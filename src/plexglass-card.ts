import { LitElement, html, css, nothing } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  PlexCardConfig,
  RecentItem,
  SectionConfig,
  StatConfig,
  StreamInfo,
} from './types';
import { rangeAxisLabel, rangeLabel, t } from './i18n';
import { fmtAgo, fmtBitrate, fmtBytes, fmtClock, fmtDuration, fmtNumber } from './format';
import { findPlayers, itemsFromSensor, livePosition, toStream } from './data';
import {
  fetchJellyfinRecentlyAdded,
  fetchPlexRecentlyAdded,
  fetchSeerrCounts,
} from './api';
import type { RequestCounts } from './api';
import { fetchSeries, sampleSteps } from './history';
import { areaChart } from './chart';
import { brandTheme } from './brands';
import type { BrandTheme } from './brands';
import './editor';
import './mini-card';

const CARD_VERSION = '0.1.0';

const CARD_STYLES = ['default', 'glass', 'material', 'bubble', 'mirror'];

const HISTORY_REFRESH_MS = 5 * 60 * 1000;
const RECENT_REFRESH_MS = 10 * 60 * 1000;
const SEERR_REFRESH_MS = 5 * 60 * 1000;
const ACTIVITY_SAMPLES = 48;

/** default range toggle: 24 h / 7 d / 30 d / 90 d (in hours) */
const DEFAULT_RANGES = [24, 168, 720, 2160];

interface RemoteCache<T> {
  data?: T;
  error?: boolean;
  at: number;
  /** fetch in flight */
  busy?: boolean;
}

@customElement('plexglass-card')
export class PlexglassCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: PlexCardConfig;
  @state() private _historyCache: Record<string, RemoteCache<number[]>> = {};
  @state() private _recentCache: Record<number, RemoteCache<RecentItem[]>> = {};
  @state() private _seerrCache: Record<number, RemoteCache<RequestCounts>> = {};
  /** selected range (hours) per activity section index */
  @state() private _range: Record<number, number> = {};

  private _ticker?: number;

  public setConfig(config: PlexCardConfig): void {
    if (!config || !Array.isArray(config.sections) || !config.sections.length) {
      throw new Error('plexglass-card: please define at least one section');
    }
    this._config = config;
    this._historyCache = {};
    this._recentCache = {};
    this._seerrCache = {};
  }

  public getCardSize(): number {
    return 2 + (this._config?.sections.length ?? 0) * 2;
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('plexglass-card-editor');
  }

  public static getStubConfig(hass: HomeAssistant): Partial<PlexCardConfig> {
    const ids = Object.keys(hass?.states ?? {});
    const count = ids.find((id) => id.includes('tautulli') && id.includes('stream_count') && !id.includes('direct') && !id.includes('transcode'));
    const sections: SectionConfig[] = [{ type: 'now_playing', ...(count ? { count_entity: count } : {}) }];
    if (count) sections.push({ type: 'activity', entity: count });
    return { title: 'Plex', brand: 'plex', sections };
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._ticker) {
      clearInterval(this._ticker);
      this._ticker = undefined;
    }
  }

  /* ---- data plumbing ---------------------------------------------------- */

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (!this.hass || !this._config) return;
    this._syncTicker();
    this._maybeFetch();
  }

  /** 1 s re-render tick while something is playing (live progress bars) */
  private _syncTicker(): void {
    const playing = (this._config?.sections ?? []).some(
      (s) =>
        s.type === 'now_playing' &&
        findPlayers(this.hass, s, this._brand().match).some((e) => e.state === 'playing')
    );
    if (playing && !this._ticker) {
      this._ticker = window.setInterval(() => this.requestUpdate(), 1000);
    } else if (!playing && this._ticker) {
      clearInterval(this._ticker);
      this._ticker = undefined;
    }
  }

  private _maybeFetch(): void {
    const now = Date.now();
    this._config!.sections.forEach((s, i) => {
      if (s.type === 'activity') {
        const entity = this._activityEntity(s);
        if (!entity) return;
        const hours = this._activityHours(s, i);
        const key = `${entity}|${hours}`;
        const c = this._historyCache[key];
        if (c?.busy || (c && now - c.at < HISTORY_REFRESH_MS)) return;
        this._historyCache = { ...this._historyCache, [key]: { ...c, at: now, busy: true } };
        fetchSeries(this.hass, entity, hours)
          .then((pts) => {
            const data = sampleSteps(pts, hours, ACTIVITY_SAMPLES);
            this._historyCache = { ...this._historyCache, [key]: { data, at: Date.now() } };
          })
          .catch(() => {
            this._historyCache = { ...this._historyCache, [key]: { error: true, at: Date.now() } };
          });
      }
      if (s.type === 'recently_added' && s.url && s.token) {
        const c = this._recentCache[i];
        if (c?.busy || (c && now - c.at < RECENT_REFRESH_MS)) return;
        this._recentCache = { ...this._recentCache, [i]: { ...c, at: now, busy: true } };
        const limit = s.limit ?? 10;
        const p =
          s.api === 'jellyfin'
            ? fetchJellyfinRecentlyAdded(s.url, s.token, limit, s.user_id)
            : fetchPlexRecentlyAdded(s.url, s.token, limit);
        p.then((items) => {
          this._recentCache = { ...this._recentCache, [i]: { data: items, at: Date.now() } };
        }).catch(() => {
          this._recentCache = { ...this._recentCache, [i]: { ...this._recentCache[i], error: true, busy: false, at: Date.now() } };
        });
      }
      if (s.type === 'requests' && s.url && s.token) {
        const c = this._seerrCache[i];
        if (c?.busy || (c && now - c.at < SEERR_REFRESH_MS)) return;
        this._seerrCache = { ...this._seerrCache, [i]: { ...c, at: now, busy: true } };
        fetchSeerrCounts(s.url, s.token)
          .then((data) => {
            this._seerrCache = { ...this._seerrCache, [i]: { data, at: Date.now() } };
          })
          .catch(() => {
            this._seerrCache = { ...this._seerrCache, [i]: { ...this._seerrCache[i], error: true, busy: false, at: Date.now() } };
          });
      }
    });
  }

  private _activityEntity(s: SectionConfig): string | undefined {
    if (s.entity) return s.entity;
    const np = this._config?.sections.find((x) => x.type === 'now_playing' && x.count_entity);
    return np?.count_entity;
  }

  /** range toggle options for an activity section (empty = no toggle) */
  private _activityRanges(s: SectionConfig): number[] {
    if (s.ranges) return s.ranges;
    // custom `hours` with no explicit ranges → single fixed window, no toggle
    if (s.hours && !DEFAULT_RANGES.includes(s.hours)) return [];
    return DEFAULT_RANGES;
  }

  /** currently selected window (hours) for an activity section */
  private _activityHours(s: SectionConfig, i: number): number {
    if (this._range[i] != null) return this._range[i];
    const ranges = this._activityRanges(s);
    if (s.hours) return s.hours;
    return ranges[0] ?? 24;
  }

  /* ---- helpers ----------------------------------------------------------- */

  private _brand(): BrandTheme {
    return brandTheme(this._config?.brand, this._config?.accent);
  }

  private _cardStyle(): string {
    const s = this._config?.card_style ?? 'default';
    return CARD_STYLES.includes(s) ? s : 'default';
  }

  private _num(entityId?: string, attribute?: string): number {
    if (!entityId) return NaN;
    const e = this.hass.states[entityId];
    if (!e) return NaN;
    const raw = attribute ? e.attributes[attribute] : e.state;
    return typeof raw === 'number' ? raw : parseFloat(raw);
  }

  private _stat(cfg: string | StatConfig): StatConfig {
    return typeof cfg === 'string' ? { entity: cfg } : cfg;
  }

  private _statValue(c: StatConfig): string {
    const e = this.hass.states[c.entity];
    if (!e) return '–';
    const raw = c.attribute ? e.attributes[c.attribute] : e.state;
    const num = typeof raw === 'number' ? raw : parseFloat(raw);
    const unit = c.unit ?? e.attributes.unit_of_measurement ?? '';
    const fmt = c.format ?? (Number.isFinite(num) ? 'number' : 'text');
    switch (fmt) {
      case 'bytes':
        return fmtBytes(num, this.hass, unit || 'b');
      case 'duration':
        return fmtDuration(num, this.hass);
      case 'number':
        return `${fmtNumber(num, this.hass)}${unit ? ` ${unit}` : ''}`;
      default:
        return String(raw ?? '–');
    }
  }

  private _statName(c: StatConfig): string {
    if (c.name) return c.name;
    const e = this.hass.states[c.entity];
    return e?.attributes.friendly_name ?? c.entity;
  }

  private _moreInfo(entityId?: string): void {
    if (!entityId) return;
    this.dispatchEvent(
      new CustomEvent('hass-more-info', {
        detail: { entityId },
        bubbles: true,
        composed: true,
      })
    );
  }

  /* ---- render ------------------------------------------------------------ */

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const c = this._config;
    const brand = this._brand();
    const cardClass = ['cardroot', `s-${this._cardStyle()}`, c.flush ? 'flush' : ''].join(' ');
    const vars = `--pg-accent:${brand.accent};--pg-accent2:${brand.accent2};`;
    const inner = html`
      ${this._renderHeader()}
      <div class="sections">${c.sections.map((s, i) => this._renderSection(s, i))}</div>
    `;
    return c.background === false
      ? html`<div class="${cardClass} nobg" style=${vars}>${inner}</div>`
      : html`<ha-card class=${cardClass} style=${vars}>${inner}</ha-card>`;
  }

  private _renderHeader(): TemplateResult | typeof nothing {
    const c = this._config!;
    if (!c.title && !c.subtitle) return nothing;
    const status = c.status_entity ? this.hass.states[c.status_entity] : undefined;
    const online = status ? !['off', 'unavailable', 'unknown', '0'].includes(status.state) : undefined;
    return html`
      <div class="header">
        <div class="brandmark">
          <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z" /></svg>
        </div>
        <div class="header-text">
          <div class="title">
            ${c.title}
            ${online !== undefined
              ? html`<span
                  class="statusdot ${online ? 'on' : 'off'}"
                  title=${online ? t(this.hass, 'online') : t(this.hass, 'offline')}
                ></span>`
              : nothing}
          </div>
          ${c.subtitle ? html`<div class="subtitle">${c.subtitle}</div>` : nothing}
        </div>
        ${this._renderHeaderChips()}
      </div>
    `;
  }

  private _renderHeaderChips(): TemplateResult | typeof nothing {
    const np = this._config!.sections.find((s) => s.type === 'now_playing');
    if (!np) return nothing;
    const count = Number.isFinite(this._num(np.count_entity))
      ? this._num(np.count_entity)
      : findPlayers(this.hass, np, this._brand().match).length;
    const bw = this._num(np.bandwidth_entity);
    return html`
      <div class="header-chips">
        <span class="chip accented">
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>
          ${fmtNumber(count, this.hass)}
          ${count === 1 ? t(this.hass, 'stream') : t(this.hass, 'streams')}
        </span>
        ${Number.isFinite(bw) && bw > 0
          ? html`<span class="chip">
              <ha-icon icon="mdi:speedometer"></ha-icon>
              ${fmtBitrate(bw, this.hass)}
            </span>`
          : nothing}
      </div>
    `;
  }

  private _renderSection(s: SectionConfig, i: number): TemplateResult | typeof nothing {
    switch (s.type) {
      case 'now_playing':
        return this._renderNowPlaying(s);
      case 'stats':
      case 'custom':
        return this._renderStats(s);
      case 'recently_added':
        return this._renderRecent(s, i);
      case 'activity':
        return this._renderActivity(s, i);
      case 'top':
        return this._renderTop(s);
      case 'requests':
        return this._renderRequests(s, i);
      default:
        return nothing;
    }
  }

  private _sectionHead(s: SectionConfig, defaultIcon: string, extra?: TemplateResult): TemplateResult | typeof nothing {
    const title = s.title ?? t(this.hass, s.type);
    if (title === '') return nothing;
    return html`
      <div class="sec-head">
        <ha-icon .icon=${s.icon ?? defaultIcon}></ha-icon>
        <span class="sec-title">${title}</span>
        ${extra ?? nothing}
      </div>
    `;
  }

  /* ---- now playing ------------------------------------------------------- */

  private _renderNowPlaying(s: SectionConfig): TemplateResult {
    const streams = findPlayers(this.hass, s, this._brand().match).map(toStream);
    const chips = this._transcodeChips(s);
    return html`
      <div class="section">
        ${this._sectionHead(s, 'mdi:play-box-multiple', chips)}
        ${streams.length
          ? html`<div class="streams">
              ${streams.map((st) =>
                s.layout === 'compact' ? this._streamRow(st) : this._streamCard(st)
              )}
            </div>`
          : s.show_idle === false
            ? nothing
            : html`<div class="idle">
                <ha-icon icon="mdi:filmstrip-off"></ha-icon>
                <div>
                  <div class="idle-title">${t(this.hass, 'nothing_playing')}</div>
                  <div class="idle-hint">${t(this.hass, 'idle_hint')}</div>
                </div>
              </div>`}
      </div>
    `;
  }

  private _transcodeChips(s: SectionConfig): TemplateResult | undefined {
    const direct = this._num(s.direct_entity);
    const trans = this._num(s.transcode_entity);
    if (!Number.isFinite(direct) && !Number.isFinite(trans)) return undefined;
    return html`<span class="sec-chips">
      ${Number.isFinite(direct)
        ? html`<span class="chip good"
            ><ha-icon icon="mdi:play-speed"></ha-icon>${fmtNumber(direct, this.hass)}
            ${t(this.hass, 'direct_play')}</span
          >`
        : nothing}
      ${Number.isFinite(trans)
        ? html`<span class="chip ${trans > 0 ? 'warn' : ''}"
            ><ha-icon icon="mdi:cog-transfer-outline"></ha-icon>${fmtNumber(trans, this.hass)}
            ${t(this.hass, 'transcode')}</span
          >`
        : nothing}
    </span>`;
  }

  private _progress(st: StreamInfo): { pct: number; pos: number; left: number } | undefined {
    const pos = livePosition(st);
    if (pos == null || !st.duration) return undefined;
    return { pct: Math.min(100, (pos / st.duration) * 100), pos, left: st.duration - pos };
  }

  private _stateBadge(st: StreamInfo): TemplateResult | typeof nothing {
    if (st.state === 'paused')
      return html`<span class="chip statechip"><ha-icon icon="mdi:pause"></ha-icon>${t(this.hass, 'paused')}</span>`;
    if (st.state === 'buffering')
      return html`<span class="chip statechip"><ha-icon icon="mdi:timer-sand"></ha-icon>${t(this.hass, 'buffering')}</span>`;
    return nothing;
  }

  private _avatar(user?: string): TemplateResult | typeof nothing {
    if (!user) return nothing;
    return html`<span class="avatar" title=${user}>${user.slice(0, 1).toUpperCase()}</span>`;
  }

  private _mediaIcon(st: StreamInfo): string {
    if (st.mediaType === 'music') return 'mdi:music';
    if (st.mediaType === 'episode' || st.mediaType === 'tvshow') return 'mdi:television-classic';
    return 'mdi:movie-open';
  }

  private _streamCard(st: StreamInfo): TemplateResult {
    const p = this._progress(st);
    return html`
      <div class="stream ${st.state}" @click=${() => this._moreInfo(st.entityId)}>
        ${st.poster ? html`<div class="backdrop" style="background-image:url('${st.poster}')"></div>` : nothing}
        <div class="stream-inner">
          ${st.poster
            ? html`<img class="poster" src=${st.poster} alt="" loading="lazy" />`
            : html`<div class="poster poster-empty"><ha-icon .icon=${this._mediaIcon(st)}></ha-icon></div>`}
          <div class="stream-info">
            <div class="stream-title">${st.title}</div>
            ${st.subline ? html`<div class="stream-sub">${st.subline}</div>` : nothing}
            <div class="stream-meta">
              ${this._avatar(st.user)}
              ${st.user ? html`<span class="username">${st.user}</span>` : nothing}
              ${st.device
                ? html`<span class="device"><ha-icon icon="mdi:monitor-small"></ha-icon>${st.device}</span>`
                : nothing}
              ${this._stateBadge(st)}
            </div>
            ${p
              ? html`
                  <div class="progress">
                    <div class="bar"><div class="fill" style="width:${p.pct}%"></div></div>
                    <div class="times">
                      <span>${fmtClock(p.pos)}</span>
                      <span>-${fmtClock(p.left)}</span>
                    </div>
                  </div>
                `
              : nothing}
          </div>
        </div>
      </div>
    `;
  }

  private _streamRow(st: StreamInfo): TemplateResult {
    const p = this._progress(st);
    return html`
      <div class="streamrow ${st.state}" @click=${() => this._moreInfo(st.entityId)}>
        ${st.poster
          ? html`<img class="rowposter" src=${st.poster} alt="" loading="lazy" />`
          : html`<div class="rowposter poster-empty"><ha-icon .icon=${this._mediaIcon(st)}></ha-icon></div>`}
        <div class="row-info">
          <div class="row-top">
            <span class="stream-title">${st.title}</span>
            ${this._stateBadge(st)}
          </div>
          ${st.subline ? html`<div class="stream-sub">${st.subline}</div>` : nothing}
          <div class="row-bottom">
            ${this._avatar(st.user)}
            <span class="username">${st.user ?? st.device ?? ''}</span>
            ${p ? html`<span class="row-time">${fmtClock(p.pos)} / ${fmtClock(st.duration!)}</span>` : nothing}
          </div>
          ${p ? html`<div class="bar slim"><div class="fill" style="width:${p.pct}%"></div></div>` : nothing}
        </div>
      </div>
    `;
  }

  /* ---- stats / custom ----------------------------------------------------- */

  private _renderStats(s: SectionConfig): TemplateResult {
    const stats = (s.stats ?? s.entities ?? []).map((x) => this._stat(x));
    return html`
      <div class="section">
        ${this._sectionHead(s, s.type === 'custom' ? 'mdi:gauge' : 'mdi:bookshelf')}
        <div class="stat-grid" style="--pg-cols:${s.columns ?? Math.min(3, Math.max(2, stats.length))}">
          ${stats.map((c) => {
            const missing = !this.hass.states[c.entity];
            return html`
              <div class="stat" @click=${() => this._moreInfo(c.entity)}>
                <span class="iconchip" style=${c.color ? `--pg-accent:${c.color};--pg-accent2:${c.color}` : ''}>
                  <ha-icon .icon=${c.icon ?? 'mdi:counter'}></ha-icon>
                </span>
                <div class="stat-body">
                  <div class="stat-value">${missing ? '–' : this._statValue(c)}</div>
                  <div class="stat-label">${missing ? t(this.hass, 'entity_missing') : this._statName(c)}</div>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  /* ---- recently added ------------------------------------------------------ */

  private _renderRecent(s: SectionConfig, i: number): TemplateResult {
    let items: RecentItem[] = [];
    let error = false;
    if (s.url && s.token) {
      const c = this._recentCache[i];
      items = c?.data ?? [];
      error = !!c?.error && !c?.data;
    } else {
      items = itemsFromSensor(s.entity ? this.hass.states[s.entity] : undefined);
    }
    items = items.slice(0, s.limit ?? 10);
    return html`
      <div class="section">
        ${this._sectionHead(s, 'mdi:new-box')}
        ${error
          ? html`<div class="err">${t(this.hass, 'fetch_error')}</div>`
          : items.length
            ? html`
                <div class="shelf">
                  ${items.map((it) => {
                    const isNew = it.added != null && Date.now() - it.added < 48 * 3600000;
                    return html`
                      <div class="shelf-item" title=${it.title}>
                        <div class="shelf-poster">
                          ${it.poster
                            ? html`<img src=${it.poster} alt="" loading="lazy" />`
                            : html`<ha-icon icon="mdi:movie-open-outline"></ha-icon>`}
                          ${isNew ? html`<span class="newbadge">${t(this.hass, 'new')}</span>` : nothing}
                        </div>
                        <div class="shelf-title">${it.title}</div>
                        <div class="shelf-sub">
                          ${it.subline ?? ''}${it.added ? html` <span class="shelf-ago">${fmtAgo(it.added, this.hass)}</span>` : nothing}
                        </div>
                      </div>
                    `;
                  })}
                </div>
              `
            : html`<div class="err soft">${t(this.hass, 'no_items')}</div>`}
      </div>
    `;
  }

  /* ---- activity ------------------------------------------------------------ */

  private _renderActivity(s: SectionConfig, i: number): TemplateResult {
    const entity = this._activityEntity(s);
    const hours = this._activityHours(s, i);
    const ranges = this._activityRanges(s);
    const cache = entity ? this._historyCache[`${entity}|${hours}`] : undefined;
    const samples = cache?.data;
    const current = this._num(entity);
    const peak = samples?.length ? Math.max(...samples, Number.isFinite(current) ? current : 0) : NaN;
    const chips = html`<span class="sec-chips">
      ${Number.isFinite(current)
        ? html`<span class="chip accented">${t(this.hass, 'now')}: ${fmtNumber(current, this.hass)}</span>`
        : nothing}
      ${Number.isFinite(peak)
        ? html`<span class="chip">${t(this.hass, 'peak')}: ${fmtNumber(peak, this.hass)}</span>`
        : nothing}
    </span>`;
    return html`
      <div class="section">
        ${this._sectionHead(s, 'mdi:chart-areaspline', chips)}
        ${ranges.length > 1
          ? html`<div class="rangetabs">
              ${ranges.map(
                (h) => html`<button
                  class="rangetab ${h === hours ? 'active' : ''}"
                  @click=${() => this._selectRange(i, h)}
                >
                  ${rangeLabel(this.hass, h)}
                </button>`
              )}
            </div>`
          : nothing}
        ${!entity
          ? html`<div class="err soft">${t(this.hass, 'entity_missing')}</div>`
          : samples
            ? html`<div class="chart">
                ${areaChart(samples, {
                  id: `pg-area-${i}`,
                  accent: s.color ?? 'var(--pg-accent)',
                  grid: true,
                })}
                <div class="chart-x">
                  <span>${rangeAxisLabel(this.hass, hours)}</span>
                  <span>${t(this.hass, 'now')}</span>
                </div>
              </div>`
            : cache?.error
              ? html`<div class="err soft">${t(this.hass, 'no_data')}</div>`
              : html`<div class="chart loading"></div>`}
      </div>
    `;
  }

  private _selectRange(i: number, hours: number): void {
    this._range = { ...this._range, [i]: hours };
  }

  /* ---- top ------------------------------------------------------------------ */

  private _renderTop(s: SectionConfig): TemplateResult {
    const rows = (s.entities ?? s.stats ?? []).map((x) => this._stat(x));
    return html`
      <div class="section">
        ${this._sectionHead(s, 'mdi:trophy-outline')}
        <div class="toplist">
          ${rows.map((c, idx) => {
            const e = this.hass.states[c.entity];
            return html`
              <div class="toprow" @click=${() => this._moreInfo(c.entity)}>
                <span class="rank r${idx + 1}">${idx + 1}</span>
                <span class="iconchip small"><ha-icon .icon=${c.icon ?? 'mdi:star'}></ha-icon></span>
                <div class="top-body">
                  <div class="top-value">${e ? this._statValue(c) : '–'}</div>
                  <div class="stat-label">${this._statName(c)}</div>
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  /* ---- requests -------------------------------------------------------------- */

  private _renderRequests(s: SectionConfig, i: number): TemplateResult {
    if (s.url && s.token) {
      const c = this._seerrCache[i];
      const d = c?.data;
      const tiles: { key: keyof RequestCounts; icon: string; cls?: string }[] = [
        { key: 'pending', icon: 'mdi:clock-outline', cls: 'warn' },
        { key: 'approved', icon: 'mdi:check-circle-outline', cls: 'good' },
        { key: 'processing', icon: 'mdi:progress-download' },
        { key: 'available', icon: 'mdi:play-circle-outline', cls: 'good' },
      ];
      return html`
        <div class="section">
          ${this._sectionHead(s, 'mdi:message-plus-outline')}
          ${d
            ? html`<div class="stat-grid" style="--pg-cols:${s.columns ?? 4}">
                ${tiles
                  .filter((x) => d[x.key] != null)
                  .map(
                    (x) => html`
                      <div class="stat">
                        <span class="iconchip ${x.cls ?? ''}"><ha-icon .icon=${x.icon}></ha-icon></span>
                        <div class="stat-body">
                          <div class="stat-value">${fmtNumber(d[x.key]!, this.hass)}</div>
                          <div class="stat-label">${t(this.hass, x.key)}</div>
                        </div>
                      </div>
                    `
                  )}
              </div>`
            : html`<div class="err ${c?.error ? '' : 'soft'}">
                ${c?.error ? t(this.hass, 'fetch_error') : t(this.hass, 'no_data')}
              </div>`}
        </div>
      `;
    }
    // sensor mode: same tiles from configured entities
    return this._renderStats({ ...s, stats: s.entities ?? s.stats ?? [] });
  }

  /* ---- styles ----------------------------------------------------------------- */

  static styles = css`
    :host {
      --pg-accent: #e5a00d;
      --pg-accent2: #f7c247;
      --pg-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
      --pg-tile-bg: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      --pg-tile-radius: 16px;
      --pg-text: var(--primary-text-color);
      --pg-text2: var(--secondary-text-color);
    }
    ha-card.cardroot,
    .cardroot.nobg {
      padding: 16px;
      overflow: hidden;
      position: relative;
    }
    .cardroot.flush {
      padding: 0;
    }

    /* ---- header ---- */
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 2px 2px 14px;
    }
    .brandmark {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      flex: none;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent2));
      box-shadow: 0 4px 14px color-mix(in srgb, var(--pg-accent) 40%, transparent);
    }
    .brandmark svg {
      width: 22px;
      height: 22px;
      fill: #fff;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
    }
    .header-text {
      flex: 1;
      min-width: 0;
    }
    .title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--pg-text);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .subtitle {
      font-size: 0.82rem;
      color: var(--pg-text2);
    }
    .statusdot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex: none;
    }
    .statusdot.on {
      background: var(--success-color, #2e7d32);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--success-color, #2e7d32) 25%, transparent);
      animation: pg-pulse 2.4s ease-in-out infinite;
    }
    .statusdot.off {
      background: var(--error-color, #c62828);
    }
    @keyframes pg-pulse {
      0%, 100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--success-color, #2e7d32) 25%, transparent); }
      50% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--success-color, #2e7d32) 10%, transparent); }
    }
    .header-chips {
      display: flex;
      gap: 6px;
      flex: none;
    }

    /* ---- chips ---- */
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 9px;
      border-radius: 999px;
      font-size: 0.74rem;
      font-weight: 600;
      color: var(--pg-text2);
      background: var(--pg-tile-bg);
      white-space: nowrap;
    }
    .chip ha-icon {
      --mdc-icon-size: 14px;
    }
    .chip.accented {
      background: color-mix(in srgb, var(--pg-accent) 18%, transparent);
      color: color-mix(in srgb, var(--pg-accent) 70%, var(--pg-text));
    }
    .chip.good {
      background: color-mix(in srgb, var(--success-color, #2e7d32) 14%, transparent);
      color: var(--success-color, #2e7d32);
    }
    .chip.warn {
      background: color-mix(in srgb, var(--warning-color, #fb8c00) 16%, transparent);
      color: var(--warning-color, #fb8c00);
    }

    /* ---- sections ---- */
    .sections {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .sec-head {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 10px;
      color: var(--pg-text2);
    }
    .sec-head > ha-icon {
      --mdc-icon-size: 17px;
      color: var(--pg-accent);
    }
    .sec-title {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      flex: 1;
    }
    .sec-chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    /* ---- now playing ---- */
    .streams {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .stream {
      position: relative;
      border-radius: var(--pg-tile-radius);
      overflow: hidden;
      background: #101015;
      cursor: pointer;
      color: #fff;
    }
    .backdrop {
      position: absolute;
      inset: -20px;
      background-size: cover;
      background-position: center 20%;
      filter: blur(22px) saturate(1.3) brightness(0.55);
      transform: scale(1.15);
    }
    .stream-inner {
      position: relative;
      display: flex;
      gap: 14px;
      padding: 14px;
      background: linear-gradient(100deg, rgba(10, 10, 16, 0.55), rgba(10, 10, 16, 0.18));
    }
    .poster {
      width: 74px;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      border-radius: 10px;
      flex: none;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
    }
    .poster-empty {
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.6);
    }
    .stream-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
      justify-content: center;
    }
    .stream-title {
      font-weight: 700;
      font-size: 1rem;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }
    .stream-sub {
      font-size: 0.8rem;
      opacity: 0.85;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .stream-meta {
      display: flex;
      align-items: center;
      gap: 7px;
      flex-wrap: wrap;
      margin-top: 2px;
      font-size: 0.76rem;
    }
    .stream .chip,
    .stream .device {
      background: rgba(255, 255, 255, 0.14);
      color: rgba(255, 255, 255, 0.92);
    }
    .device {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 9px;
      border-radius: 999px;
      font-size: 0.74rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 220px;
    }
    .device ha-icon {
      --mdc-icon-size: 13px;
    }
    .avatar {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      flex: none;
      display: grid;
      place-items: center;
      font-size: 0.72rem;
      font-weight: 800;
      color: #fff;
      background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent2));
    }
    .username {
      font-weight: 600;
      opacity: 0.95;
    }
    .progress {
      margin-top: 6px;
    }
    .bar {
      height: 5px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
      overflow: hidden;
    }
    .bar.slim {
      height: 3px;
      margin-top: 6px;
      background: color-mix(in srgb, var(--pg-text) 14%, transparent);
    }
    .fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--pg-accent), var(--pg-accent2));
      transition: width 0.9s linear;
    }
    .paused .fill {
      background: rgba(255, 255, 255, 0.55);
    }
    .times {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      opacity: 0.8;
      margin-top: 3px;
      font-variant-numeric: tabular-nums;
    }

    /* compact rows */
    .streamrow {
      display: flex;
      gap: 12px;
      padding: 10px;
      border-radius: var(--pg-tile-radius);
      background: var(--pg-tile-bg);
      cursor: pointer;
      color: var(--pg-text);
    }
    .rowposter {
      width: 46px;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      border-radius: 7px;
      flex: none;
    }
    .row-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
    }
    .row-top {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .streamrow .stream-title {
      font-size: 0.9rem;
      -webkit-line-clamp: 1;
      text-shadow: none;
      flex: 1;
    }
    .streamrow .stream-sub {
      color: var(--pg-text2);
      opacity: 1;
    }
    .row-bottom {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 0.76rem;
      color: var(--pg-text2);
    }
    .row-time {
      margin-left: auto;
      font-variant-numeric: tabular-nums;
      font-size: 0.72rem;
    }
    .streamrow .chip {
      background: color-mix(in srgb, var(--pg-text) 8%, transparent);
      color: var(--pg-text2);
    }

    /* idle */
    .idle {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px 16px;
      border-radius: var(--pg-tile-radius);
      background: var(--pg-tile-bg);
      color: var(--pg-text2);
    }
    .idle ha-icon {
      --mdc-icon-size: 30px;
      opacity: 0.55;
    }
    .idle-title {
      font-weight: 700;
      color: var(--pg-text);
    }
    .idle-hint {
      font-size: 0.78rem;
    }

    /* ---- stats ---- */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(var(--pg-cols, 3), 1fr);
      gap: 10px;
    }
    .stat {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border-radius: var(--pg-tile-radius);
      background: var(--pg-tile-bg);
      cursor: pointer;
      min-width: 0;
    }
    .iconchip {
      width: 36px;
      height: 36px;
      border-radius: 11px;
      flex: none;
      display: grid;
      place-items: center;
      color: var(--pg-accent);
      background: color-mix(in srgb, var(--pg-accent) 16%, transparent);
    }
    .iconchip ha-icon {
      --mdc-icon-size: 19px;
    }
    .iconchip.small {
      width: 30px;
      height: 30px;
      border-radius: 9px;
    }
    .iconchip.good {
      color: var(--success-color, #2e7d32);
      background: color-mix(in srgb, var(--success-color, #2e7d32) 14%, transparent);
    }
    .iconchip.warn {
      color: var(--warning-color, #fb8c00);
      background: color-mix(in srgb, var(--warning-color, #fb8c00) 16%, transparent);
    }
    .stat-body {
      min-width: 0;
    }
    .stat-value {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--pg-text);
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .stat-label {
      font-size: 0.72rem;
      color: var(--pg-text2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* ---- shelf (recently added) ---- */
    .shelf {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 6px;
      scrollbar-width: thin;
      scroll-snap-type: x proximity;
    }
    .shelf-item {
      width: 96px;
      flex: none;
      scroll-snap-align: start;
    }
    .shelf-poster {
      position: relative;
      width: 96px;
      aspect-ratio: 2 / 3;
      border-radius: 10px;
      overflow: hidden;
      background: var(--pg-tile-bg);
      display: grid;
      place-items: center;
      color: var(--pg-text2);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
      transition: transform 0.18s ease;
    }
    .shelf-item:hover .shelf-poster {
      transform: translateY(-3px) scale(1.03);
    }
    .shelf-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .newbadge {
      position: absolute;
      top: 6px;
      left: 6px;
      padding: 2px 6px;
      border-radius: 6px;
      font-size: 0.6rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: #fff;
      background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent2));
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    }
    .shelf-title {
      margin-top: 6px;
      font-size: 0.76rem;
      font-weight: 700;
      color: var(--pg-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .shelf-sub {
      font-size: 0.68rem;
      color: var(--pg-text2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .shelf-ago {
      opacity: 0.8;
    }

    /* ---- chart ---- */
    .chart {
      border-radius: var(--pg-tile-radius);
      background: var(--pg-tile-bg);
      padding: 10px 10px 8px;
    }
    .chart svg {
      display: block;
      width: 100%;
      height: 110px;
    }
    .chart .grid {
      stroke: color-mix(in srgb, var(--pg-text) 12%, transparent);
      stroke-dasharray: 3 4;
      vector-effect: non-scaling-stroke;
    }
    .chart .gridlabel {
      font-size: 9px;
      fill: var(--pg-text2);
    }
    .chart-x {
      display: flex;
      justify-content: space-between;
      font-size: 0.68rem;
      color: var(--pg-text2);
      margin-top: 4px;
    }
    .chart.loading {
      height: 130px;
      border-radius: var(--pg-tile-radius);
      background: linear-gradient(
        100deg,
        var(--pg-tile-bg) 30%,
        color-mix(in srgb, var(--pg-text) 8%, var(--pg-tile-bg)) 50%,
        var(--pg-tile-bg) 70%
      );
      background-size: 200% 100%;
      animation: pg-shimmer 1.4s ease-in-out infinite;
    }
    @keyframes pg-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* ---- range toggle ---- */
    .rangetabs {
      display: flex;
      gap: 4px;
      margin-bottom: 10px;
      padding: 3px;
      border-radius: 999px;
      background: var(--pg-tile-bg);
      width: fit-content;
    }
    .rangetab {
      border: none;
      background: none;
      cursor: pointer;
      font: inherit;
      font-size: 0.74rem;
      font-weight: 600;
      color: var(--pg-text2);
      padding: 4px 12px;
      border-radius: 999px;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .rangetab:hover {
      color: var(--pg-text);
    }
    .rangetab.active {
      color: #fff;
      background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent2));
      box-shadow: 0 2px 8px color-mix(in srgb, var(--pg-accent) 35%, transparent);
    }

    /* ---- top ---- */
    .toplist {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .toprow {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: var(--pg-tile-radius);
      background: var(--pg-tile-bg);
      cursor: pointer;
    }
    .rank {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      flex: none;
      display: grid;
      place-items: center;
      font-size: 0.76rem;
      font-weight: 800;
      color: var(--pg-text2);
      background: color-mix(in srgb, var(--pg-text) 8%, transparent);
    }
    .rank.r1 {
      color: #7a5c00;
      background: linear-gradient(135deg, #ffd76a, #e5a00d);
    }
    .rank.r2 {
      color: #494f57;
      background: linear-gradient(135deg, #e8edf2, #b7c0ca);
    }
    .rank.r3 {
      color: #5b3a1e;
      background: linear-gradient(135deg, #e3a878, #b97333);
    }
    .top-body {
      min-width: 0;
      flex: 1;
    }
    .top-value {
      font-weight: 700;
      color: var(--pg-text);
      font-size: 0.92rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* ---- misc ---- */
    .err {
      padding: 12px 14px;
      border-radius: var(--pg-tile-radius);
      background: color-mix(in srgb, var(--error-color, #c62828) 10%, transparent);
      color: var(--error-color, #c62828);
      font-size: 0.8rem;
    }
    .err.soft {
      background: var(--pg-tile-bg);
      color: var(--pg-text2);
    }

    /* ---- card styles ---- */
    .s-glass {
      --pg-tile-bg: color-mix(in srgb, var(--pg-card-bg) 42%, transparent);
      --pg-tile-radius: 20px;
    }
    ha-card.cardroot.s-glass {
      background: color-mix(in srgb, var(--pg-card-bg) 55%, transparent);
      -webkit-backdrop-filter: blur(18px) saturate(1.5);
      backdrop-filter: blur(18px) saturate(1.5);
    }
    .s-glass .stat,
    .s-glass .streamrow,
    .s-glass .idle,
    .s-glass .toprow,
    .s-glass .chart {
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, #fff 25%, transparent),
        0 8px 24px color-mix(in srgb, #000 10%, transparent);
      -webkit-backdrop-filter: blur(18px) saturate(1.5);
      backdrop-filter: blur(18px) saturate(1.5);
    }
    .s-glass .stream {
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.18),
        0 10px 28px rgba(0, 0, 0, 0.3);
    }
    .s-glass .iconchip {
      border: 1px solid color-mix(in srgb, #fff 30%, transparent);
      box-shadow: inset 0 1px 0 color-mix(in srgb, #fff 40%, transparent);
    }

    .s-material {
      --pg-tile-radius: 22px;
      --pg-tile-bg: color-mix(in srgb, var(--pg-accent) 10%, var(--pg-card-bg));
    }
    ha-card.cardroot.s-material {
      border-radius: 28px;
    }
    .s-material .iconchip {
      border-radius: 13px;
      background: var(--pg-accent);
      color: var(--pg-card-bg);
    }
    .s-material .brandmark {
      border-radius: 14px;
    }

    .s-bubble {
      --pg-tile-bg: var(--pg-card-bg);
      --pg-tile-radius: 26px;
    }
    ha-card.cardroot.s-bubble {
      background: none;
      box-shadow: none;
      border: none;
    }
    .s-bubble .stat,
    .s-bubble .streamrow,
    .s-bubble .idle,
    .s-bubble .toprow,
    .s-bubble .chart {
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08));
    }
    .s-bubble .stream {
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.18));
    }

    .s-mirror {
      --pg-tile-bg: #000;
      --pg-tile-radius: 12px;
      --pg-text: #fff;
      --pg-text2: #bbb;
      color: #fff;
    }
    ha-card.cardroot.s-mirror {
      background: #000;
      box-shadow: none;
      border: none;
    }
    .s-mirror .stat,
    .s-mirror .streamrow,
    .s-mirror .idle,
    .s-mirror .toprow,
    .s-mirror .chart,
    .s-mirror .shelf-poster {
      border: 1px solid rgba(255, 255, 255, 0.28);
      background: #000;
    }
    .s-mirror .stream {
      border: 1px solid rgba(255, 255, 255, 0.28);
    }
    .s-mirror .brandmark {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow: none;
    }
    .s-mirror .brandmark svg {
      fill: #fff;
    }
    .s-mirror .title,
    .s-mirror .stat-value,
    .s-mirror .top-value {
      color: #fff;
    }
    .s-mirror .subtitle,
    .s-mirror .stat-label,
    .s-mirror .sec-head,
    .s-mirror .chart-x {
      color: #bbb;
    }
    .s-mirror .sec-head > ha-icon,
    .s-mirror .iconchip {
      color: #fff;
      background: #000;
    }
    .s-mirror .chip,
    .s-mirror .chip.accented {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: #ddd;
    }
    .s-mirror .fill {
      background: #fff;
    }
    .s-mirror .rangetabs {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.28);
    }
    .s-mirror .rangetab.active {
      background: #fff;
      color: #000;
      box-shadow: none;
    }
    .s-mirror .avatar,
    .s-mirror .newbadge {
      background: #fff;
      color: #000;
    }
    .s-mirror .rank.r1,
    .s-mirror .rank.r2,
    .s-mirror .rank.r3 {
      background: #fff;
      color: #000;
    }

    @media (max-width: 460px) {
      .stat-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .header-chips .chip:not(.accented) {
        display: none;
      }
    }
  `;
}

/* ---- registration ---------------------------------------------------------- */

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: 'plexglass-card',
  name: 'Plexglass',
  description:
    'Cinematic media-server dashboard: active streams (Plex/Jellyfin/Emby), library stats, recently added, activity graph and requests.',
  preview: true,
});

console.info(
  `%c PLEXGLASS %c v${CARD_VERSION} `,
  'background:#e5a00d;color:#1f1f1f;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px;',
  'background:#282a2d;color:#e5a00d;border-radius:0 4px 4px 0;padding:2px 6px;'
);
