import { LitElement, html, css, nothing } from 'lit';
import type { PropertyValues, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { Brand, CardStyle, HomeAssistant } from './types';
import { brandTheme } from './brands';
import { t } from './i18n';
import { fmtBitrate, fmtNumber } from './format';
import { findPlayers } from './data';
import { fetchSeries, sampleSteps } from './history';
import { areaChart } from './chart';

const MINI_STYLES = ['default', 'glass', 'material', 'bubble', 'mirror'];
const SPARK_SAMPLES = 32;
const REFRESH_MS = 5 * 60 * 1000;

export interface MiniCardConfig {
  type: string;
  title?: string;
  brand?: Brand;
  accent?: string;
  card_style?: CardStyle;
  /** stream-count sensor (Tautulli). Omitted: count active media_players */
  count_entity?: string;
  /** auto-discovery filter when no count_entity (default: brand) */
  match?: string;
  direct_entity?: string;
  transcode_entity?: string;
  bandwidth_entity?: string;
  /** sparkline source (default: count_entity) */
  entity?: string;
  /** sparkline window in hours (default 24) */
  hours?: number;
  status_entity?: string;
  background?: boolean;
}

@customElement('plexglass-mini-card')
export class PlexglassMiniCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: MiniCardConfig;
  @state() private _spark?: number[];
  @state() private _sparkAt = 0;
  private _busy = false;

  public setConfig(config: MiniCardConfig): void {
    this._config = config;
    this._spark = undefined;
    this._sparkAt = 0;
  }

  public getCardSize(): number {
    return 1;
  }

  public static getConfigElement(): HTMLElement {
    return document.createElement('plexglass-mini-card-editor');
  }

  public static getStubConfig(hass: HomeAssistant): Partial<MiniCardConfig> {
    const ids = Object.keys(hass?.states ?? {});
    const count = ids.find(
      (id) => id.includes('tautulli') && id.includes('stream_count') && !id.includes('direct') && !id.includes('transcode')
    );
    return { title: 'Plex', brand: 'plex', ...(count ? { count_entity: count } : {}) };
  }

  protected updated(changed: PropertyValues): void {
    super.updated(changed);
    if (!this.hass || !this._config) return;
    const entity = this._sparkEntity();
    if (!entity) return;
    const now = Date.now();
    if (this._busy || (this._spark && now - this._sparkAt < REFRESH_MS)) return;
    this._busy = true;
    const hours = this._config.hours ?? 24;
    fetchSeries(this.hass, entity, hours)
      .then((pts) => {
        this._spark = sampleSteps(pts, hours, SPARK_SAMPLES);
        this._sparkAt = Date.now();
        this._busy = false;
      })
      .catch(() => {
        this._busy = false;
        this._sparkAt = Date.now();
      });
  }

  private _sparkEntity(): string | undefined {
    return this._config?.entity ?? this._config?.count_entity;
  }

  private _num(entityId?: string): number {
    if (!entityId) return NaN;
    const e = this.hass.states[entityId];
    if (!e) return NaN;
    return typeof e.state === 'number' ? e.state : parseFloat(e.state);
  }

  private _count(): number {
    const c = this._config!;
    const n = this._num(c.count_entity);
    if (Number.isFinite(n)) return n;
    return findPlayers(this.hass, { type: 'now_playing', match: c.match }, brandTheme(c.brand).match).length;
  }

  private _cardStyle(): string {
    const s = this._config?.card_style ?? 'default';
    return MINI_STYLES.includes(s) ? s : 'default';
  }

  private _moreInfo(): void {
    const id = this._config?.count_entity ?? this._config?.entity;
    if (!id) return;
    this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true }));
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const c = this._config;
    const theme = brandTheme(c.brand, c.accent);
    const count = this._count();
    const direct = this._num(c.direct_entity);
    const trans = this._num(c.transcode_entity);
    const bw = this._num(c.bandwidth_entity);
    const status = c.status_entity ? this.hass.states[c.status_entity] : undefined;
    const online = status ? !['off', 'unavailable', 'unknown', '0'].includes(status.state) : undefined;
    const active = Number.isFinite(count) && count > 0;
    const cls = ['mini', `s-${this._cardStyle()}`].join(' ');
    const vars = `--pg-accent:${theme.accent};--pg-accent2:${theme.accent2};`;

    const inner = html`
      <div class="mini-inner" @click=${() => this._moreInfo()}>
        <div class="brandmark ${active ? '' : 'idle'}">
          <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z" /></svg>
        </div>
        <div class="mini-body">
          <div class="mini-top">
            <span class="mini-title">${c.title ?? 'Plex'}</span>
            ${online !== undefined
              ? html`<span class="statusdot ${online ? 'on' : 'off'}"></span>`
              : nothing}
          </div>
          <div class="mini-chips">
            ${Number.isFinite(direct) && direct > 0
              ? html`<span class="mchip good"><ha-icon icon="mdi:play-speed"></ha-icon>${fmtNumber(direct, this.hass)}</span>`
              : nothing}
            ${Number.isFinite(trans) && trans > 0
              ? html`<span class="mchip warn"><ha-icon icon="mdi:cog-transfer-outline"></ha-icon>${fmtNumber(trans, this.hass)}</span>`
              : nothing}
            ${Number.isFinite(bw) && bw > 0
              ? html`<span class="mchip"><ha-icon icon="mdi:speedometer"></ha-icon>${fmtBitrate(bw, this.hass)}</span>`
              : nothing}
            ${!active ? html`<span class="mchip">${t(this.hass, 'nothing_playing')}</span>` : nothing}
          </div>
        </div>
        <div class="mini-count ${active ? 'active' : ''}">
          <span class="mini-num">${Number.isFinite(count) ? fmtNumber(count, this.hass) : '–'}</span>
          <span class="mini-unit">${count === 1 ? t(this.hass, 'stream') : t(this.hass, 'streams')}</span>
        </div>
      </div>
      ${this._spark && this._spark.some((v) => v > 0)
        ? html`<div class="mini-spark">
            ${areaChart(this._spark, { id: 'pg-mini-spark', accent: theme.accent, height: 40, grid: false, dot: false })}
          </div>`
        : nothing}
    `;

    return c.background === false
      ? html`<div class="${cls} nobg" style=${vars}>${inner}</div>`
      : html`<ha-card class=${cls} style=${vars}>${inner}</ha-card>`;
  }

  static styles = css`
    :host {
      --pg-accent: #e5a00d;
      --pg-accent2: #f7c247;
      --pg-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
      --pg-tile-bg: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      --pg-text: var(--primary-text-color);
      --pg-text2: var(--secondary-text-color);
    }
    ha-card.mini,
    .mini.nobg {
      overflow: hidden;
      position: relative;
    }
    .mini-inner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      cursor: pointer;
    }
    .brandmark {
      width: 36px;
      height: 36px;
      border-radius: 11px;
      flex: none;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent2));
      box-shadow: 0 4px 12px color-mix(in srgb, var(--pg-accent) 38%, transparent);
    }
    .brandmark.idle {
      background: var(--pg-tile-bg);
      box-shadow: none;
    }
    .brandmark svg {
      width: 20px;
      height: 20px;
      fill: #fff;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
    }
    .brandmark.idle svg {
      fill: var(--pg-text2);
      filter: none;
    }
    .mini-body {
      flex: 1;
      min-width: 0;
    }
    .mini-top {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .mini-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--pg-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .statusdot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex: none;
    }
    .statusdot.on {
      background: var(--success-color, #2e7d32);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--success-color, #2e7d32) 22%, transparent);
    }
    .statusdot.off {
      background: var(--error-color, #c62828);
    }
    .mini-chips {
      display: flex;
      gap: 5px;
      margin-top: 3px;
      flex-wrap: wrap;
    }
    .mchip {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--pg-text2);
      background: var(--pg-tile-bg);
      white-space: nowrap;
    }
    .mchip ha-icon {
      --mdc-icon-size: 13px;
    }
    .mchip.good {
      color: var(--success-color, #2e7d32);
      background: color-mix(in srgb, var(--success-color, #2e7d32) 14%, transparent);
    }
    .mchip.warn {
      color: var(--warning-color, #fb8c00);
      background: color-mix(in srgb, var(--warning-color, #fb8c00) 16%, transparent);
    }
    .mini-count {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      flex: none;
      line-height: 1;
    }
    .mini-num {
      font-size: 1.7rem;
      font-weight: 800;
      color: var(--pg-text2);
      font-variant-numeric: tabular-nums;
    }
    .mini-count.active .mini-num {
      color: transparent;
      background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent2));
      -webkit-background-clip: text;
      background-clip: text;
    }
    .mini-unit {
      font-size: 0.64rem;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--pg-text2);
      margin-top: 3px;
    }
    .mini-spark {
      height: 40px;
      margin-top: -6px;
    }
    .mini-spark svg {
      display: block;
      width: 100%;
      height: 40px;
    }

    /* ---- styles ---- */
    .s-glass {
      --pg-tile-bg: color-mix(in srgb, var(--pg-card-bg) 42%, transparent);
    }
    ha-card.mini.s-glass {
      background: color-mix(in srgb, var(--pg-card-bg) 55%, transparent);
      -webkit-backdrop-filter: blur(18px) saturate(1.5);
      backdrop-filter: blur(18px) saturate(1.5);
    }
    .s-material .brandmark {
      border-radius: 13px;
    }
    ha-card.mini.s-material {
      border-radius: 24px;
    }
    ha-card.mini.s-bubble {
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08));
    }
    .s-mirror {
      --pg-tile-bg: #000;
      --pg-text: #fff;
      --pg-text2: #bbb;
      color: #fff;
    }
    ha-card.mini.s-mirror {
      background: #000;
      box-shadow: none;
      border: none;
    }
    .s-mirror .brandmark {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow: none;
    }
    .s-mirror .brandmark svg {
      fill: #fff;
    }
    .s-mirror .mini-title {
      color: #fff;
    }
    .s-mirror .mchip {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #ddd;
    }
    .s-mirror .mini-count.active .mini-num {
      color: #fff;
      -webkit-background-clip: initial;
      background-clip: initial;
      background: none;
    }
  `;
}

/* ---- editor ---------------------------------------------------------------- */

const MINI_LABELS: Record<string, Record<string, string>> = {
  en: {
    title: 'Title',
    brand: 'Brand',
    accent: 'Accent color (overrides brand)',
    card_style: 'Style',
    count_entity: 'Stream count sensor (empty = count players)',
    match: 'Auto-discover filter',
    direct_entity: 'Direct-play sensor',
    transcode_entity: 'Transcode sensor',
    bandwidth_entity: 'Bandwidth sensor (kbps)',
    entity: 'Sparkline sensor (default: stream count)',
    hours: 'Sparkline window (hours)',
    status_entity: 'Server status entity',
    background: 'Card background',
  },
  de: {
    title: 'Titel',
    brand: 'Marke',
    accent: 'Akzentfarbe (überschreibt Marke)',
    card_style: 'Stil',
    count_entity: 'Stream-Anzahl-Sensor (leer = Player zählen)',
    match: 'Auto-Erkennungs-Filter',
    direct_entity: 'Direct-Play-Sensor',
    transcode_entity: 'Transkodierungs-Sensor',
    bandwidth_entity: 'Bandbreiten-Sensor (kbps)',
    entity: 'Sparkline-Sensor (Standard: Stream-Anzahl)',
    hours: 'Sparkline-Fenster (Stunden)',
    status_entity: 'Server-Status-Entität',
    background: 'Kartenhintergrund',
  },
};

const BRAND_OPTS = ['plex', 'jellyfin', 'emby', 'tautulli', 'neutral'];
const STYLE_OPTS = ['default', 'glass', 'material', 'bubble', 'mirror'];

@customElement('plexglass-mini-card-editor')
export class PlexglassMiniCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: MiniCardConfig;

  public setConfig(config: MiniCardConfig): void {
    this._config = config;
  }

  private _label(key: string): string {
    const l = (this.hass?.locale?.language ?? this.hass?.language ?? 'en').split('-')[0];
    return MINI_LABELS[l]?.[key] ?? MINI_LABELS.en[key] ?? key;
  }

  private _schema(): unknown[] {
    return [
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'title', selector: { text: {} } },
          {
            name: 'brand',
            selector: { select: { mode: 'dropdown', options: BRAND_OPTS.map((v) => ({ value: v, label: cap(v) })) } },
          },
          {
            name: 'card_style',
            selector: { select: { mode: 'dropdown', options: STYLE_OPTS.map((v) => ({ value: v, label: cap(v) })) } },
          },
          { name: 'accent', selector: { text: {} } },
        ],
      },
      { name: 'count_entity', selector: { entity: {} } },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'direct_entity', selector: { entity: {} } },
          { name: 'transcode_entity', selector: { entity: {} } },
          { name: 'bandwidth_entity', selector: { entity: {} } },
          { name: 'status_entity', selector: { entity: {} } },
        ],
      },
      { name: 'entity', selector: { entity: {} } },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'hours', selector: { number: { min: 3, max: 168, mode: 'box' } } },
          { name: 'match', selector: { text: {} } },
        ],
      },
      { name: 'background', selector: { boolean: {} } },
    ];
  }

  private _changed(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const v = ev.detail.value as Record<string, unknown>;
    const next: Record<string, unknown> = { ...this._config, ...v };
    for (const [k, val] of Object.entries(next)) {
      if (val === '' || val === undefined) delete next[k];
    }
    if (next.brand === 'plex') delete next.brand;
    if (next.card_style === 'default') delete next.card_style;
    if (next.background === true) delete next.background;
    this._config = next as unknown as MiniCardConfig;
    this.dispatchEvent(
      new CustomEvent('config-changed', { detail: { config: next }, bubbles: true, composed: true })
    );
  }

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ brand: 'plex', card_style: 'default', hours: 24, background: true, ...this._config }}
        .schema=${this._schema()}
        .computeLabel=${(s: { name: string }) => this._label(s.name)}
        @value-changed=${this._changed}
      ></ha-form>
    `;
  }
}

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: 'plexglass-mini-card',
  name: 'Plexglass Mini',
  description: 'Compact current-activity badge: stream count, direct/transcode, bandwidth and a sparkline.',
  preview: true,
});
