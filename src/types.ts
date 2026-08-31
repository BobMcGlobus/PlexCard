export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  locale?: { language: string };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}

/** default (Plex amber), jellyfin (purple/blue), emby (green), tautulli (gold) */
export type Brand = 'plex' | 'jellyfin' | 'emby' | 'tautulli' | 'neutral';
export type CardStyle = 'default' | 'glass' | 'material' | 'bubble' | 'mirror';

export type SectionType =
  | 'now_playing'
  | 'stats'
  | 'recently_added'
  | 'activity'
  | 'top'
  | 'requests'
  | 'custom';

/** A single labeled value tile/row (library size, request count, …) */
export interface StatConfig {
  entity: string;
  name?: string;
  icon?: string;
  /** read this attribute instead of the state */
  attribute?: string;
  unit?: string;
  /** number (locale-grouped), bytes (auto GB/TB), duration (min → h), text */
  format?: 'number' | 'bytes' | 'duration' | 'text';
  color?: string;
}

export interface SectionConfig {
  type: SectionType;
  /** Section heading (empty string hides the default heading) */
  title?: string;
  icon?: string;

  /* ---- now_playing ---------------------------------------------------- */
  /** Explicit media_player entities. Empty: auto-discover via `match`. */
  players?: string[];
  /** Substring for auto-discovery on media_player entity ids (default: brand) */
  match?: string;
  /** compact: slim rows without backdrop art */
  layout?: 'full' | 'compact';
  /** Placeholder tile when nothing is playing (default true) */
  show_idle?: boolean;
  /** Tautulli enrichment chips shown in the section header */
  count_entity?: string;
  direct_entity?: string;
  transcode_entity?: string;
  /** bandwidth sensor in kbps (Tautulli WAN/total) */
  bandwidth_entity?: string;

  /* ---- stats / top / requests / custom -------------------------------- */
  stats?: (string | StatConfig)[];
  entities?: (string | StatConfig)[];
  columns?: number;

  /* ---- recently_added -------------------------------------------------- */
  /** Sensor holding items (upcoming-media-card `data` format works) */
  entity?: string;
  /** Direct API mode: server base url (http://plex:32400, https://jellyfin/…) */
  url?: string;
  /** X-Plex-Token / Jellyfin API key / Overseerr API key */
  token?: string;
  api?: 'plex' | 'jellyfin' | 'overseerr';
  /** Jellyfin: user id for /Users/{id}/Items/Latest */
  user_id?: string;
  limit?: number;

  /* ---- activity -------------------------------------------------------- */
  /** Numeric sensor to graph (default: count_entity of now_playing) */
  hours?: number;
  color?: string;
  /**
   * Range toggle above the chart, in hours. Default [24, 168, 720, 2160]
   * (24 h / 7 d / 30 d / 90 d). Set [] to hide the toggle and just use `hours`.
   * Ranges over 7 days fall back to daily long-term statistics.
   */
  ranges?: number[];
}

export interface PlexCardConfig {
  type: string;
  title?: string;
  subtitle?: string;
  /** Accent + logo mark preset */
  brand?: Brand;
  /** Custom accent color (overrides brand) */
  accent?: string;
  card_style?: CardStyle;
  /** Server online dot next to the title (sensor/binary_sensor) */
  status_entity?: string;
  /** false: remove the ha-card background/shadow (for use inside containers) */
  background?: boolean;
  /** true: no outer padding */
  flush?: boolean;
  /**
   * Minimal mode for mobile: the card shrinks to a compact now-playing peek
   * (who is streaming, or "nothing playing"); tapping it opens a popup with
   * the full sections.
   */
  collapsed?: boolean;
  sections: SectionConfig[];
}

/** One active playback session, normalized from a media_player entity */
export interface StreamInfo {
  entityId: string;
  state: 'playing' | 'paused' | 'buffering';
  user?: string;
  /** main line: movie title / series title / artist */
  title: string;
  /** S7 · E48 · Episode title / year / album */
  subline?: string;
  mediaType?: string;
  poster?: string;
  /** player app / device */
  device?: string;
  /** seconds (as reported; extrapolate while playing) */
  position?: number;
  duration?: number;
  /** epoch ms of media_position_updated_at */
  positionUpdatedAt?: number;
}

/** Normalized recently-added entry (sensor or direct API) */
export interface RecentItem {
  title: string;
  subline?: string;
  poster?: string;
  /** epoch ms */
  added?: number;
  type?: string;
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}
