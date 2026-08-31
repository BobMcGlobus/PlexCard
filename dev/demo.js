// Dev-only harness: stubs ha-card / ha-icon and a minimal `hass` object
// (Plex media_players + Tautulli sensors + fake recorder history) so the
// card can be developed outside Home Assistant.
import '../src/plexglass-card.ts';

// ---- ha-card stub -----------------------------------------------------------
customElements.define(
  'ha-card',
  class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
          :host {
            display: block;
            background: var(--ha-card-background, var(--card-background-color, #fff));
            border-radius: var(--ha-card-border-radius, 12px);
            box-shadow: var(--ha-card-box-shadow, 0 2px 10px rgba(0,0,0,0.06));
            color: var(--primary-text-color);
          }
        </style>
        <slot></slot>`;
    }
  }
);

// ---- ha-icon stub (loads real MDI icons from CDN, dev only) ------------------
const iconCache = new Map();
customElements.define(
  'ha-icon',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['icon'];
    }
    constructor() {
      super();
      this.attachShadow({ mode: 'open' }).innerHTML = `
        <style>
          :host { display: inline-flex; width: var(--mdc-icon-size, 24px); height: var(--mdc-icon-size, 24px); }
          svg { width: 100%; height: 100%; fill: currentColor; display: block; }
        </style>
        <span id="s"></span>`;
    }
    set icon(v) {
      this._icon = v;
      this._render();
    }
    get icon() {
      return this._icon;
    }
    attributeChangedCallback(_n, _o, v) {
      this.icon = v;
    }
    async _render() {
      const name = (this._icon || '').replace('mdi:', '');
      if (!name) return;
      if (!iconCache.has(name)) {
        iconCache.set(
          name,
          fetch(`https://cdn.jsdelivr.net/npm/@mdi/svg@7.4.47/svg/${name}.svg`)
            .then((r) => (r.ok ? r.text() : ''))
            .catch(() => '')
        );
      }
      const svg = await iconCache.get(name);
      if (this._icon && this._icon.replace('mdi:', '') === name) {
        this.shadowRoot.getElementById('s').innerHTML = svg;
        this.shadowRoot.getElementById('s').style.display = 'contents';
      }
    }
  }
);

// ---- fake posters -----------------------------------------------------------
const PALETTES = [
  ['#1b2a4a', '#4a7bd0'],
  ['#3a1b4a', '#b04ad0'],
  ['#4a2a1b', '#d0824a'],
  ['#1b4a35', '#4ad096'],
  ['#4a1b26', '#d04a6b'],
  ['#22344a', '#7d9cc7'],
  ['#443a12', '#e5a00d'],
];

function poster(title, idx) {
  const [c1, c2] = PALETTES[idx % PALETTES.length];
  const initial = title.slice(0, 1).toUpperCase();
  const short = title.length > 16 ? `${title.slice(0, 15)}…` : title;
  return (
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
        </linearGradient>
      </defs>
      <rect width="200" height="300" fill="url(#g)"/>
      <circle cx="160" cy="40" r="70" fill="#ffffff14"/>
      <circle cx="30" cy="270" r="90" fill="#00000022"/>
      <text x="100" y="165" font-family="Segoe UI, sans-serif" font-size="110" font-weight="800"
        fill="#ffffff2e" text-anchor="middle">${initial}</text>
      <text x="100" y="272" font-family="Segoe UI, sans-serif" font-size="17" font-weight="700"
        fill="#ffffffd8" text-anchor="middle">${short}</text>
    </svg>`)
  );
}

// ---- mock states ------------------------------------------------------------
const now = Date.now();
const iso = (ms) => new Date(ms).toISOString();

function entity(id, state, attrs = {}) {
  return {
    entity_id: id,
    state: String(state),
    attributes: attrs,
    last_changed: iso(now - 3600000),
    last_updated: iso(now - 60000),
  };
}

function mkStates(streamsOn) {
  const players = streamsOn
    ? {
        'media_player.plex_plex_web_microsoft_edge': entity(
          'media_player.plex_plex_web_microsoft_edge',
          'playing',
          {
            friendly_name: 'Plex (Plex Web - Microsoft Edge)',
            app_name: 'Plex Web',
            media_content_type: 'episode',
            media_content_id: '146732',
            media_title: 'Love-Story im Polizeihauptquartier 8',
            media_series_title: 'Detektiv Conan',
            media_season: 7,
            media_episode: 48,
            media_duration: 1470,
            media_position: 620,
            media_position_updated_at: iso(now - 12000),
            username: 'BobMcGlobus',
            entity_picture: poster('Detektiv Conan', 0),
          }
        ),
        // owner-doubling: same session exposed as a second entity (device
        // client). Same media_content_id + username → deduped to one card.
        'media_player.plex_microsoft_edge': entity('media_player.plex_microsoft_edge', 'playing', {
          friendly_name: 'Plex (Microsoft Edge)',
          app_name: 'Plex Web',
          media_content_type: 'episode',
          media_content_id: '146732',
          media_title: 'Love-Story im Polizeihauptquartier 8',
          media_series_title: 'Detektiv Conan',
          media_season: 7,
          media_episode: 48,
          media_duration: 1470,
          media_position: 620,
          media_position_updated_at: iso(now - 12000),
          username: 'BobMcGlobus',
        }),
        'media_player.plex_plex_for_lg_tv': entity('media_player.plex_plex_for_lg_tv', 'paused', {
          friendly_name: 'Plex (Plex for LG - Wohnzimmer TV)',
          app_name: 'Plex for LG',
          media_content_type: 'movie',
          media_title: 'Interstellar',
          media_year: 2014,
          media_duration: 10140,
          media_position: 4980,
          media_position_updated_at: iso(now - 300000),
          username: 'Lena',
          entity_picture: poster('Interstellar', 1),
        }),
        'media_player.plex_plexamp_pixel': entity('media_player.plex_plexamp_pixel', 'playing', {
          friendly_name: 'Plex (Plexamp - Pixel 9)',
          app_name: 'Plexamp',
          media_content_type: 'music',
          media_title: 'Time',
          media_artist: 'Hans Zimmer',
          media_album_name: 'Inception (OST)',
          media_duration: 275,
          media_position: 84,
          media_position_updated_at: iso(now - 5000),
          username: 'Jonas',
          entity_picture: poster('Hans Zimmer', 6),
        }),
      }
    : {};

  const recent = [
    { title_default: '$title' },
    { title: 'Frieren', number: 'S2 · E4', poster: poster('Frieren', 3), aired: iso(now - 6 * 3600000), type: 'episode' },
    { title: 'Dune: Part Two', year: 2024, poster: poster('Dune', 2), aired: iso(now - 26 * 3600000), type: 'movie' },
    { title: 'Detektiv Conan', number: 'S7 · E49', poster: poster('Detektiv Conan', 0), aired: iso(now - 40 * 3600000), type: 'episode' },
    { title: 'Vinland Saga', number: 'S2 · E11', poster: poster('Vinland Saga', 4), aired: iso(now - 3 * 86400000), type: 'episode' },
    { title: 'Oppenheimer', year: 2023, poster: poster('Oppenheimer', 5), aired: iso(now - 5 * 86400000), type: 'movie' },
    { title: 'Spirited Away', year: 2001, poster: poster('Spirited Away', 1), aired: iso(now - 8 * 86400000), type: 'movie' },
  ];

  return {
    ...players,
    'binary_sensor.plex_domovoi': entity('binary_sensor.plex_domovoi', 'on', {
      friendly_name: 'Plex Domovoi',
    }),
    'sensor.tautulli_stream_count': entity('sensor.tautulli_stream_count', streamsOn ? 3 : 0, {
      friendly_name: 'Tautulli Stream Count',
    }),
    'sensor.tautulli_stream_count_direct_play': entity(
      'sensor.tautulli_stream_count_direct_play',
      streamsOn ? 2 : 0,
      { friendly_name: 'Direct Play' }
    ),
    'sensor.tautulli_stream_count_transcode': entity(
      'sensor.tautulli_stream_count_transcode',
      streamsOn ? 1 : 0,
      { friendly_name: 'Transcode' }
    ),
    'sensor.tautulli_total_bandwidth': entity('sensor.tautulli_total_bandwidth', streamsOn ? 24800 : 0, {
      friendly_name: 'Total Bandwidth',
      unit_of_measurement: 'kbps',
    }),
    'sensor.plex_domovoi_library_filme': entity('sensor.plex_domovoi_library_filme', 1473, {
      friendly_name: 'Filme',
    }),
    'sensor.plex_domovoi_library_serien': entity('sensor.plex_domovoi_library_serien', 353, {
      friendly_name: 'Serien',
    }),
    'sensor.plex_domovoi_library_anime': entity('sensor.plex_domovoi_library_anime', 312, {
      friendly_name: 'Anime',
    }),
    'sensor.plex_domovoi_library_anime_filme': entity('sensor.plex_domovoi_library_anime_filme', 144, {
      friendly_name: 'Anime Filme',
    }),
    'sensor.plex_domovoi_library_musik': entity('sensor.plex_domovoi_library_musik', 108, {
      friendly_name: 'Musik',
    }),
    'sensor.mediathek_groesse': entity('sensor.mediathek_groesse', 18.4, {
      friendly_name: 'Speicher',
      unit_of_measurement: 'TB',
    }),
    'sensor.tautulli_top_movie': entity('sensor.tautulli_top_movie', 'Interstellar', {
      friendly_name: 'Top Film',
    }),
    'sensor.tautulli_top_tv': entity('sensor.tautulli_top_tv', 'Detektiv Conan', {
      friendly_name: 'Top Serie',
    }),
    'sensor.tautulli_top_user': entity('sensor.tautulli_top_user', 'BobMcGlobus', {
      friendly_name: 'Top Nutzer',
    }),
    'sensor.overseerr_pending': entity('sensor.overseerr_pending', 3, {
      friendly_name: 'Ausstehend',
    }),
    'sensor.overseerr_approved': entity('sensor.overseerr_approved', 12, {
      friendly_name: 'Genehmigt',
    }),
    'sensor.overseerr_available': entity('sensor.overseerr_available', 9, {
      friendly_name: 'Verfügbar',
    }),
    'sensor.plex_recently_added': entity('sensor.plex_recently_added', recent.length - 1, {
      friendly_name: 'Recently Added',
      data: recent,
    }),
  };
}

// ---- fake recorder history (stream count over the last 24 h) ----------------
function fakeHistory(entityId, startMs, endMs) {
  const pts = [];
  let v = 0;
  for (let t = startMs; t < endMs; t += 30 * 60000) {
    const hour = new Date(t).getHours();
    const evening = hour >= 18 || hour <= 1;
    const p = evening ? 0.5 : 0.18;
    if (Math.random() < p) v = Math.min(4, v + (Math.random() < 0.7 ? 1 : 2));
    else if (Math.random() < 0.4) v = Math.max(0, v - 1);
    pts.push({ s: String(v), lu: t / 1000 });
  }
  pts.push({ s: '3', lu: (endMs - 60000) / 1000 });
  return { [entityId]: pts };
}

// daily long-term statistics (for 30d / 90d ranges) — a peak per day
function fakeStats(entityId, startMs, endMs) {
  const rows = [];
  const day = 86400000;
  const d0 = new Date(startMs);
  d0.setHours(0, 0, 0, 0);
  for (let t = d0.getTime(); t < endMs; t += day) {
    const dow = new Date(t).getDay(); // weekend busier
    const base = dow === 0 || dow === 6 ? 4 : 2;
    const max = Math.max(0, Math.round(base + (Math.random() * 3 - 1)));
    rows.push({ start: t, max, mean: max * 0.4 });
  }
  return { [entityId]: rows };
}

// ---- hass -------------------------------------------------------------------
let streamsOn = true;

function mkHass() {
  return {
    language: 'de',
    locale: { language: 'de' },
    states: mkStates(streamsOn),
    callWS(msg) {
      if (msg.type === 'history/history_during_period') {
        const id = msg.entity_ids[0];
        return Promise.resolve(
          fakeHistory(id, Date.parse(msg.start_time), Date.parse(msg.end_time))
        );
      }
      if (msg.type === 'recorder/statistics_during_period') {
        const id = msg.statistic_ids[0];
        return Promise.resolve(
          fakeStats(id, Date.parse(msg.start_time), Date.parse(msg.end_time))
        );
      }
      return Promise.resolve({});
    },
  };
}

// ---- card + toolbar ---------------------------------------------------------
const config = {
  type: 'custom:plexglass-card',
  title: 'Domovoi',
  subtitle: 'Plex Media Server · 1.43.2',
  brand: 'plex',
  status_entity: 'binary_sensor.plex_domovoi',
  sections: [
    {
      type: 'now_playing',
      count_entity: 'sensor.tautulli_stream_count',
      direct_entity: 'sensor.tautulli_stream_count_direct_play',
      transcode_entity: 'sensor.tautulli_stream_count_transcode',
      bandwidth_entity: 'sensor.tautulli_total_bandwidth',
    },
    {
      type: 'stats',
      columns: 3,
      stats: [
        { entity: 'sensor.plex_domovoi_library_filme', icon: 'mdi:movie-open' },
        { entity: 'sensor.plex_domovoi_library_serien', icon: 'mdi:television-classic' },
        { entity: 'sensor.plex_domovoi_library_anime', icon: 'mdi:sword' },
        { entity: 'sensor.plex_domovoi_library_anime_filme', icon: 'mdi:sword-cross' },
        { entity: 'sensor.plex_domovoi_library_musik', icon: 'mdi:music' },
        { entity: 'sensor.mediathek_groesse', icon: 'mdi:harddisk', format: 'bytes' },
      ],
    },
    { type: 'recently_added', entity: 'sensor.plex_recently_added' },
    { type: 'activity', entity: 'sensor.tautulli_stream_count' },
    {
      type: 'top',
      entities: [
        { entity: 'sensor.tautulli_top_movie', icon: 'mdi:movie-star' },
        { entity: 'sensor.tautulli_top_tv', icon: 'mdi:television-classic' },
        { entity: 'sensor.tautulli_top_user', icon: 'mdi:account-star' },
      ],
    },
    {
      type: 'requests',
      entities: [
        { entity: 'sensor.overseerr_pending', icon: 'mdi:clock-outline' },
        { entity: 'sensor.overseerr_approved', icon: 'mdi:check-circle-outline' },
        { entity: 'sensor.overseerr_available', icon: 'mdi:play-circle-outline' },
      ],
      columns: 3,
    },
  ],
};

const card = document.createElement('plexglass-card');
card.setConfig(config);
card.hass = mkHass();
document.getElementById('mount').appendChild(card);

// ---- mini card --------------------------------------------------------------
const miniConfig = {
  type: 'custom:plexglass-mini-card',
  title: 'Domovoi',
  brand: 'plex',
  status_entity: 'binary_sensor.plex_domovoi',
  count_entity: 'sensor.tautulli_stream_count',
  direct_entity: 'sensor.tautulli_stream_count_direct_play',
  transcode_entity: 'sensor.tautulli_stream_count_transcode',
  bandwidth_entity: 'sensor.tautulli_total_bandwidth',
  hours: 24,
};
const mini = document.createElement('plexglass-mini-card');
mini.setConfig(miniConfig);
mini.hass = mkHass();
const miniLabel = document.createElement('div');
miniLabel.textContent = 'plexglass-mini-card';
miniLabel.style.cssText = 'font-size:0.72rem;opacity:0.6;margin:8px 0 -8px;text-transform:uppercase;letter-spacing:0.06em;';
document.getElementById('mount').appendChild(miniLabel);
document.getElementById('mount').appendChild(mini);

// refresh media positions periodically so extrapolation stays realistic
setInterval(() => {
  card.hass = mkHass();
  mini.hass = mkHass();
}, 30000);

const STYLES = ['default', 'glass', 'material', 'bubble', 'mirror'];
let styleIdx = 0;
let wide = false;
let layoutFull = true;
let bgOn = true;
let collapsedOn = false;

function applyCard() {
  const cfg = structuredClone(config);
  cfg.card_style = STYLES[styleIdx];
  cfg.background = bgOn;
  cfg.collapsed = collapsedOn;
  cfg.sections[0].layout = layoutFull ? 'full' : 'compact';
  card.setConfig(cfg);
  card.hass = mkHass();
  mini.setConfig({ ...miniConfig, card_style: STYLES[styleIdx] });
  mini.hass = mkHass();
}

document.getElementById('theme').onclick = () => document.body.classList.toggle('dark');
document.getElementById('width').onclick = () => {
  wide = !wide;
  document.getElementById('wrap').style.maxWidth = wide ? '760px' : '440px';
};
document.getElementById('style').onclick = (e) => {
  styleIdx = (styleIdx + 1) % STYLES.length;
  applyCard();
  e.target.textContent = `Stil: ${STYLES[styleIdx]}`;
};
document.getElementById('streams').onclick = (e) => {
  streamsOn = !streamsOn;
  card.hass = mkHass();
  mini.hass = mkHass();
  e.target.textContent = `Streams: ${streamsOn ? 3 : 0}`;
};
document.getElementById('layout').onclick = (e) => {
  layoutFull = !layoutFull;
  applyCard();
  e.target.textContent = `Layout: ${layoutFull ? 'Poster' : 'Kompakt'}`;
};
document.getElementById('minimal').onclick = (e) => {
  collapsedOn = !collapsedOn;
  applyCard();
  e.target.textContent = `Minimal: ${collapsedOn ? 'an' : 'aus'}`;
};
document.getElementById('bg').onclick = () => {
  bgOn = !bgOn;
  applyCard();
};
