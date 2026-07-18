import type { HomeAssistant } from './types';

const STRINGS: Record<string, Record<string, string>> = {
  en: {
    // sections
    now_playing: 'Now playing',
    stats: 'Library',
    recently_added: 'Recently added',
    activity: 'Activity',
    top: 'Most watched',
    requests: 'Requests',
    custom: 'Sensors',
    // now playing
    nothing_playing: 'Nothing is playing',
    idle_hint: 'Active streams appear here automatically',
    streams: 'Streams',
    stream: 'Stream',
    direct_play: 'Direct Play',
    transcode: 'Transcode',
    bandwidth: 'Bandwidth',
    paused: 'Paused',
    buffering: 'Buffering',
    // recently added
    new: 'NEW',
    no_items: 'No entries',
    fetch_error: 'Not reachable — check URL/token (CORS?)',
    // requests
    pending: 'Pending',
    approved: 'Approved',
    processing: 'Processing',
    available: 'Available',
    declined: 'Declined',
    total: 'Total',
    movies: 'Movies',
    tv: 'Series',
    // activity
    last_hours: 'Last {n} h',
    last_days: 'Last {n} d',
    range_h: '{n} h',
    range_d: '{n} d',
    peak: 'Peak',
    now: 'Now',
    // misc
    entity_missing: 'Entity not found',
    no_data: 'No data',
    online: 'Online',
    offline: 'Offline',
  },
  de: {
    now_playing: 'Läuft gerade',
    stats: 'Mediathek',
    recently_added: 'Zuletzt hinzugefügt',
    activity: 'Aktivität',
    top: 'Meistgesehen',
    requests: 'Anfragen',
    custom: 'Sensoren',
    nothing_playing: 'Gerade läuft nichts',
    idle_hint: 'Aktive Streams erscheinen hier automatisch',
    streams: 'Streams',
    stream: 'Stream',
    direct_play: 'Direct Play',
    transcode: 'Transkodierung',
    bandwidth: 'Bandbreite',
    paused: 'Pausiert',
    buffering: 'Puffern',
    new: 'NEU',
    no_items: 'Keine Einträge',
    fetch_error: 'Nicht erreichbar — URL/Token prüfen (CORS?)',
    pending: 'Ausstehend',
    approved: 'Genehmigt',
    processing: 'In Arbeit',
    available: 'Verfügbar',
    declined: 'Abgelehnt',
    total: 'Gesamt',
    movies: 'Filme',
    tv: 'Serien',
    last_hours: 'Letzte {n} h',
    last_days: 'Letzte {n} T',
    range_h: '{n} h',
    range_d: '{n} T',
    peak: 'Spitze',
    now: 'Jetzt',
    entity_missing: 'Entität nicht gefunden',
    no_data: 'Keine Daten',
    online: 'Online',
    offline: 'Offline',
  },
};

export function lang(hass?: HomeAssistant): string {
  const l = (hass?.locale?.language ?? hass?.language ?? 'en').split('-')[0];
  return STRINGS[l] ? l : 'en';
}

export function t(hass: HomeAssistant | undefined, key: string, vars?: Record<string, string | number>): string {
  let s = STRINGS[lang(hass)][key] ?? STRINGS.en[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, String(v));
  return s;
}

/** Short toggle label: "24 h", "7 T"/"7 d", "30 T" … */
export function rangeLabel(hass: HomeAssistant | undefined, hours: number): string {
  return hours < 48
    ? t(hass, 'range_h', { n: hours })
    : t(hass, 'range_d', { n: Math.round(hours / 24) });
}

/** X-axis start label: "Letzte 24 h" / "Letzte 30 T" */
export function rangeAxisLabel(hass: HomeAssistant | undefined, hours: number): string {
  return hours <= 48
    ? t(hass, 'last_hours', { n: hours })
    : t(hass, 'last_days', { n: Math.round(hours / 24) });
}
