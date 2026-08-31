import { LitElement, html, css, nothing } from 'lit';
import type { TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type {
  HomeAssistant,
  PlexCardConfig,
  SectionConfig,
  SectionType,
  StatConfig,
} from './types';
import { lang, t } from './i18n';

const SECTION_TYPES: SectionType[] = [
  'now_playing',
  'stats',
  'recently_added',
  'activity',
  'top',
  'requests',
  'custom',
];

const SECTION_ICONS: Record<SectionType, string> = {
  now_playing: 'mdi:play-box-multiple',
  stats: 'mdi:bookshelf',
  recently_added: 'mdi:new-box',
  activity: 'mdi:chart-areaspline',
  top: 'mdi:trophy-outline',
  requests: 'mdi:message-plus-outline',
  custom: 'mdi:gauge',
};

/** Section types whose entity list is edited per-row (entity + name + icon) */
const ROW_LIST_TYPES: SectionType[] = ['stats', 'top', 'requests', 'custom'];

const LABELS: Record<string, Record<string, string>> = {
  en: {
    title: 'Title',
    subtitle: 'Subtitle',
    brand: 'Brand (accent + discovery)',
    brand_plex: 'Plex',
    brand_jellyfin: 'Jellyfin',
    brand_emby: 'Emby',
    brand_tautulli: 'Tautulli',
    brand_neutral: 'Neutral (theme color)',
    accent: 'Accent color (overrides brand)',
    card_style: 'Style',
    style_default: 'Default',
    style_glass: 'Liquid Glass',
    style_material: 'Material You',
    style_bubble: 'Bubble',
    style_mirror: 'Magic Mirror',
    status_entity: 'Server status entity (online dot)',
    background: 'Card background',
    flush: 'Edge to edge (no outer padding)',
    collapsed: 'Minimal mode (peek + tap for popup)',
    add_section: 'Add section',
    section_title: 'Heading (empty = hidden)',
    icon: 'Icon',
    type: 'Type',
    players: 'Media players (empty = auto-discover)',
    match: 'Auto-discover filter (entity id contains …)',
    layout: 'Layout',
    layout_full: 'Poster cards (backdrop)',
    layout_compact: 'Compact rows',
    show_idle: 'Show placeholder when idle',
    count_entity: 'Stream count sensor (Tautulli)',
    direct_entity: 'Direct-play count sensor',
    transcode_entity: 'Transcode count sensor',
    bandwidth_entity: 'Bandwidth sensor (kbps)',
    columns: 'Columns',
    entity: 'Entity',
    name: 'Name',
    format: 'Format',
    fmt_auto: 'Auto',
    fmt_number: 'Number',
    fmt_bytes: 'Bytes (GB/TB)',
    fmt_duration: 'Duration (min → h)',
    fmt_text: 'Text',
    add_row: 'Add entity',
    ra_source: 'Source',
    ra_sensor: 'Sensor (upcoming-media-card format)',
    ra_api: 'Direct API (URL + token)',
    api: 'API',
    url: 'Server URL (e.g. http://192.168.1.10:32400)',
    token: 'Token / API key',
    user_id: 'Jellyfin user id (optional)',
    limit: 'Items',
    hours: 'Time window (hours)',
    color: 'Chart color (optional)',
    seerr_hint: 'Either sensors below, or URL + API key of Overseerr/Jellyseerr.',
  },
  de: {
    title: 'Titel',
    subtitle: 'Untertitel',
    brand: 'Marke (Akzent + Auto-Erkennung)',
    brand_plex: 'Plex',
    brand_jellyfin: 'Jellyfin',
    brand_emby: 'Emby',
    brand_tautulli: 'Tautulli',
    brand_neutral: 'Neutral (Theme-Farbe)',
    accent: 'Akzentfarbe (überschreibt Marke)',
    card_style: 'Stil',
    style_default: 'Standard',
    style_glass: 'Liquid Glass',
    style_material: 'Material You',
    style_bubble: 'Bubble',
    style_mirror: 'Magic Mirror',
    status_entity: 'Server-Status-Entität (Online-Punkt)',
    background: 'Kartenhintergrund',
    flush: 'Randlos (kein Außenabstand)',
    collapsed: 'Minimal-Modus (Vorschau + Tipp öffnet Popup)',
    add_section: 'Sektion hinzufügen',
    section_title: 'Überschrift (leer = ausblenden)',
    icon: 'Icon',
    type: 'Typ',
    players: 'Media Player (leer = automatisch erkennen)',
    match: 'Auto-Erkennung: Entity-ID enthält …',
    layout: 'Layout',
    layout_full: 'Poster-Karten (Backdrop)',
    layout_compact: 'Kompakte Zeilen',
    show_idle: 'Platzhalter zeigen, wenn nichts läuft',
    count_entity: 'Stream-Anzahl-Sensor (Tautulli)',
    direct_entity: 'Direct-Play-Anzahl-Sensor',
    transcode_entity: 'Transkodierungs-Anzahl-Sensor',
    bandwidth_entity: 'Bandbreiten-Sensor (kbps)',
    columns: 'Spalten',
    entity: 'Entität',
    name: 'Name',
    format: 'Format',
    fmt_auto: 'Automatisch',
    fmt_number: 'Zahl',
    fmt_bytes: 'Bytes (GB/TB)',
    fmt_duration: 'Dauer (min → h)',
    fmt_text: 'Text',
    add_row: 'Entität hinzufügen',
    ra_source: 'Quelle',
    ra_sensor: 'Sensor (upcoming-media-card-Format)',
    ra_api: 'Direkte API (URL + Token)',
    api: 'API',
    url: 'Server-URL (z. B. http://192.168.1.10:32400)',
    token: 'Token / API-Schlüssel',
    user_id: 'Jellyfin-Benutzer-ID (optional)',
    limit: 'Einträge',
    hours: 'Zeitfenster (Stunden)',
    color: 'Diagrammfarbe (optional)',
    seerr_hint: 'Entweder Sensoren unten, oder URL + API-Key von Overseerr/Jellyseerr.',
  },
};

@customElement('plexglass-card-editor')
export class PlexglassCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config?: PlexCardConfig;
  @state() private _expanded = -1;

  public setConfig(config: PlexCardConfig): void {
    this._config = { ...config, sections: config.sections ?? [] };
  }

  private _label(key: string): string {
    const l = lang(this.hass);
    return LABELS[l]?.[key] ?? LABELS.en[key] ?? key;
  }

  private _emit(config: PlexCardConfig): void {
    this._config = config;
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    );
  }

  /* ---- top level -------------------------------------------------------- */

  private _topSchema(): unknown[] {
    const opts = (keys: string[], prefix: string) =>
      keys.map((k) => ({ value: k, label: this._label(`${prefix}_${k}`) }));
    return [
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'title', selector: { text: {} } },
          { name: 'subtitle', selector: { text: {} } },
          {
            name: 'brand',
            selector: {
              select: {
                mode: 'dropdown',
                options: opts(['plex', 'jellyfin', 'emby', 'tautulli', 'neutral'], 'brand'),
              },
            },
          },
          {
            name: 'card_style',
            selector: {
              select: {
                mode: 'dropdown',
                options: opts(['default', 'glass', 'material', 'bubble', 'mirror'], 'style'),
              },
            },
          },
        ],
      },
      { name: 'status_entity', selector: { entity: {} } },
      { name: 'accent', selector: { text: {} } },
      { name: 'collapsed', selector: { boolean: {} } },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'background', selector: { boolean: {} } },
          { name: 'flush', selector: { boolean: {} } },
        ],
      },
    ];
  }

  private _topChanged(ev: CustomEvent): void {
    ev.stopPropagation();
    if (!this._config) return;
    const v = ev.detail.value as Record<string, unknown>;
    const next: Record<string, unknown> = { ...this._config, ...v };
    for (const k of ['title', 'subtitle', 'accent', 'status_entity']) {
      if (next[k] === '' || next[k] === undefined) delete next[k];
    }
    if (next.brand === 'plex') delete next.brand;
    if (next.card_style === 'default') delete next.card_style;
    if (next.background === true) delete next.background;
    if (next.flush === false) delete next.flush;
    if (next.collapsed === false) delete next.collapsed;
    this._emit(next as unknown as PlexCardConfig);
  }

  /* ---- sections --------------------------------------------------------- */

  private _sectionSchema(s: SectionConfig): unknown[] {
    const type = s.type;
    const base: unknown[] = [
      {
        type: 'grid',
        name: '',
        schema: [
          {
            name: 'type',
            selector: {
              select: {
                mode: 'dropdown',
                options: SECTION_TYPES.map((k) => ({ value: k, label: t(this.hass, k) })),
              },
            },
          },
          { name: 'title', selector: { text: {} } },
        ],
      },
    ];
    switch (type) {
      case 'now_playing':
        return [
          ...base,
          { name: 'players', selector: { entity: { multiple: true, domain: 'media_player' } } },
          { name: 'match', selector: { text: {} } },
          {
            type: 'grid',
            name: '',
            schema: [
              {
                name: 'layout',
                selector: {
                  select: {
                    mode: 'dropdown',
                    options: [
                      { value: 'full', label: this._label('layout_full') },
                      { value: 'compact', label: this._label('layout_compact') },
                    ],
                  },
                },
              },
              { name: 'show_idle', selector: { boolean: {} } },
              { name: 'count_entity', selector: { entity: {} } },
              { name: 'bandwidth_entity', selector: { entity: {} } },
              { name: 'direct_entity', selector: { entity: {} } },
              { name: 'transcode_entity', selector: { entity: {} } },
            ],
          },
        ];
      case 'recently_added':
        return [
          ...base,
          { name: 'entity', selector: { entity: {} } },
          {
            type: 'grid',
            name: '',
            schema: [
              {
                name: 'api',
                selector: {
                  select: {
                    mode: 'dropdown',
                    options: [
                      { value: 'plex', label: 'Plex' },
                      { value: 'jellyfin', label: 'Jellyfin' },
                    ],
                  },
                },
              },
              { name: 'limit', selector: { number: { min: 3, max: 30, mode: 'box' } } },
            ],
          },
          { name: 'url', selector: { text: {} } },
          { name: 'token', selector: { text: {} } },
          ...(s.api === 'jellyfin' ? [{ name: 'user_id', selector: { text: {} } }] : []),
        ];
      case 'activity':
        return [
          ...base,
          { name: 'entity', selector: { entity: {} } },
          {
            type: 'grid',
            name: '',
            schema: [
              { name: 'hours', selector: { number: { min: 3, max: 168, mode: 'box' } } },
              { name: 'color', selector: { text: {} } },
            ],
          },
        ];
      case 'requests':
        return [
          ...base,
          { name: 'url', selector: { text: {} } },
          { name: 'token', selector: { text: {} } },
          { name: 'columns', selector: { number: { min: 1, max: 4, mode: 'box' } } },
        ];
      default:
        // stats / top / custom: rows edited below
        return [
          ...base,
          ...(type === 'stats' || type === 'custom'
            ? [{ name: 'columns', selector: { number: { min: 1, max: 4, mode: 'box' } } }]
            : []),
        ];
    }
  }

  private _sectionChanged(ev: CustomEvent, i: number): void {
    ev.stopPropagation();
    if (!this._config) return;
    const v = ev.detail.value as Record<string, unknown>;
    const next: Record<string, unknown> = { ...this._config.sections[i], ...v };
    for (const [k, val] of Object.entries(next)) {
      if (val === '' || val === undefined) delete next[k];
    }
    // empty-string heading is meaningful (hides the heading) — keep '' only if user typed something before
    if (v.title === '' && this._config.sections[i].title) next.title = '';
    const sections = [...this._config.sections];
    sections[i] = next as unknown as SectionConfig;
    this._emit({ ...this._config, sections });
  }

  /* ---- row list (stats/top/requests/custom entities) --------------------- */

  private _rows(s: SectionConfig): StatConfig[] {
    const raw = s.type === 'stats' || s.type === 'custom' ? (s.stats ?? s.entities) : (s.entities ?? s.stats);
    return (raw ?? []).map((e) => (typeof e === 'string' ? { entity: e } : e));
  }

  private _rowKey(s: SectionConfig): 'stats' | 'entities' {
    if ((s.type === 'stats' || s.type === 'custom') && !s.entities) return 'stats';
    return 'entities';
  }

  private _rowSchema(): unknown[] {
    return [
      { name: 'entity', selector: { entity: {} } },
      {
        type: 'grid',
        name: '',
        schema: [
          { name: 'name', selector: { text: {} } },
          { name: 'icon', selector: { icon: {} } },
          {
            name: 'format',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: 'auto', label: this._label('fmt_auto') },
                  { value: 'number', label: this._label('fmt_number') },
                  { value: 'bytes', label: this._label('fmt_bytes') },
                  { value: 'duration', label: this._label('fmt_duration') },
                  { value: 'text', label: this._label('fmt_text') },
                ],
              },
            },
          },
        ],
      },
    ];
  }

  private _rowChanged(ev: CustomEvent, si: number, ri: number): void {
    ev.stopPropagation();
    if (!this._config) return;
    const v = ev.detail.value as Record<string, unknown>;
    const entry: Record<string, unknown> = {};
    if (v.entity) entry.entity = v.entity;
    if (v.name) entry.name = v.name;
    if (v.icon) entry.icon = v.icon;
    if (v.format && v.format !== 'auto') entry.format = v.format;
    const section = this._config.sections[si];
    const key = this._rowKey(section);
    const rows: (string | StatConfig)[] = [...this._rows(section)];
    // plain entity ids stay strings so the YAML remains tidy
    rows[ri] =
      Object.keys(entry).length === 1 && entry.entity
        ? (entry.entity as string)
        : (entry as unknown as StatConfig);
    const sections = [...this._config.sections];
    sections[si] = { ...section, [key]: rows };
    this._emit({ ...this._config, sections });
  }

  private _addRow(si: number): void {
    if (!this._config) return;
    const section = this._config.sections[si];
    const key = this._rowKey(section);
    const rows = [...this._rows(section), { entity: '' }];
    const sections = [...this._config.sections];
    sections[si] = { ...section, [key]: rows };
    this._emit({ ...this._config, sections });
  }

  private _removeRow(si: number, ri: number): void {
    if (!this._config) return;
    const section = this._config.sections[si];
    const key = this._rowKey(section);
    const rows = this._rows(section).filter((_, i) => i !== ri);
    const sections = [...this._config.sections];
    sections[si] = { ...section, [key]: rows };
    this._emit({ ...this._config, sections });
  }

  /* ---- add / move / remove sections -------------------------------------- */

  private _addSection(): void {
    if (!this._config) return;
    const sections = [...this._config.sections, { type: 'stats' as SectionType }];
    this._emit({ ...this._config, sections });
    this._expanded = sections.length - 1;
  }

  private _move(ev: Event, i: number, dir: number): void {
    ev.stopPropagation();
    if (!this._config) return;
    const sections = [...this._config.sections];
    const j = i + dir;
    if (j < 0 || j >= sections.length) return;
    [sections[i], sections[j]] = [sections[j], sections[i]];
    this._emit({ ...this._config, sections });
    this._expanded = j;
  }

  private _remove(ev: Event, i: number): void {
    ev.stopPropagation();
    if (!this._config) return;
    const sections = this._config.sections.filter((_, x) => x !== i);
    this._emit({ ...this._config, sections });
    if (this._expanded === i) this._expanded = -1;
  }

  /* ---- render ------------------------------------------------------------- */

  protected render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${{ brand: 'plex', card_style: 'default', background: true, flush: false, collapsed: false, ...this._config }}
        .schema=${this._topSchema()}
        .computeLabel=${(s: { name: string }) => this._label(s.name)}
        @value-changed=${this._topChanged}
      ></ha-form>

      <div class="sections">
        ${this._config.sections.map((s, i) => this._renderSectionEditor(s, i))}
      </div>

      <button class="add" @click=${this._addSection}>
        <ha-icon icon="mdi:plus"></ha-icon>
        ${this._label('add_section')}
      </button>
    `;
  }

  private _renderSectionEditor(s: SectionConfig, i: number): TemplateResult {
    const open = this._expanded === i;
    const count = this._config!.sections.length;
    return html`
      <div class="section ${open ? 'open' : ''}">
        <div class="section-head" @click=${() => (this._expanded = open ? -1 : i)}>
          <span class="chip"><ha-icon .icon=${s.icon ?? SECTION_ICONS[s.type] ?? 'mdi:card'}></ha-icon></span>
          <span class="section-title">
            ${s.title || t(this.hass, s.type)}
            <span class="section-type">${s.type}</span>
          </span>
          <button class="icon-btn" .disabled=${i === 0} title="↑" @click=${(e: Event) => this._move(e, i, -1)}>
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button class="icon-btn" .disabled=${i === count - 1} title="↓" @click=${(e: Event) => this._move(e, i, 1)}>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button class="icon-btn danger" @click=${(e: Event) => this._remove(e, i)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
          <ha-icon class="expand" icon=${open ? 'mdi:chevron-up' : 'mdi:chevron-down'}></ha-icon>
        </div>
        ${open
          ? html`<div class="section-body">
              ${s.type === 'requests' ? html`<div class="hint">${this._label('seerr_hint')}</div>` : nothing}
              <ha-form
                .hass=${this.hass}
                .data=${{ layout: 'full', show_idle: true, api: 'plex', ...s }}
                .schema=${this._sectionSchema(s)}
                .computeLabel=${(x: { name: string }) =>
                  x.name === 'title' ? this._label('section_title') : this._label(x.name)}
                @value-changed=${(ev: CustomEvent) => this._sectionChanged(ev, i)}
              ></ha-form>
              ${ROW_LIST_TYPES.includes(s.type) ? this._renderRowEditor(s, i) : nothing}
            </div>`
          : nothing}
      </div>
    `;
  }

  private _renderRowEditor(s: SectionConfig, si: number): TemplateResult {
    const rows = this._rows(s);
    return html`
      <div class="sub-editor">
        ${rows.map(
          (r, ri) => html`
            <div class="sub-row">
              <ha-form
                .hass=${this.hass}
                .data=${{ format: 'auto', ...r }}
                .schema=${this._rowSchema()}
                .computeLabel=${(x: { name: string }) => this._label(x.name)}
                @value-changed=${(ev: CustomEvent) => this._rowChanged(ev, si, ri)}
              ></ha-form>
              <button class="icon-btn danger" title="✕" @click=${() => this._removeRow(si, ri)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          `
        )}
        <button class="add small" @click=${() => this._addRow(si)}>
          <ha-icon icon="mdi:plus"></ha-icon>
          ${this._label('add_row')}
        </button>
      </div>
    `;
  }

  static styles = css`
    .sections {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .section {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      overflow: hidden;
    }
    .section.open {
      border-color: var(--primary-color);
    }
    .section-head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
    }
    .chip {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      flex: none;
      display: grid;
      place-items: center;
      background: color-mix(in srgb, #e5a00d 18%, transparent);
      color: #e5a00d;
    }
    .chip ha-icon {
      --mdc-icon-size: 18px;
    }
    .section-title {
      flex: 1;
      min-width: 0;
      font-weight: 600;
      display: flex;
      flex-direction: column;
    }
    .section-type {
      font-size: 0.72rem;
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .icon-btn {
      border: none;
      background: none;
      padding: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
      border-radius: 6px;
      display: grid;
      place-items: center;
    }
    .icon-btn:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .icon-btn[disabled] {
      opacity: 0.3;
      cursor: default;
    }
    .icon-btn.danger:hover {
      color: var(--error-color);
    }
    .icon-btn ha-icon {
      --mdc-icon-size: 18px;
    }
    .expand {
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }
    .section-body {
      padding: 4px 12px 14px;
      border-top: 1px solid var(--divider-color);
    }
    .hint {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      padding: 8px 0 4px;
    }
    .add {
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 10px;
      border: 1px dashed var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
    }
    .add:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .add.small {
      margin-top: 8px;
      padding: 6px 10px;
      font-size: 0.85rem;
    }
    .sub-editor {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px dashed var(--divider-color);
    }
    .sub-row {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      margin-bottom: 10px;
    }
    .sub-row ha-form {
      flex: 1;
      min-width: 0;
    }
  `;
}
