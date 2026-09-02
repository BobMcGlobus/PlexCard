import type { HassEntity, HomeAssistant, RecentItem, SectionConfig, StreamInfo } from './types';

/** also the sort order in the stream list (active first) */
const ACTIVE_STATES = ['playing', 'buffering', 'paused'];

function num(v: unknown): number {
  return typeof v === 'number' ? v : parseFloat(v as string);
}

function user(e: HassEntity): string {
  return String(e.attributes.username ?? e.attributes.session_username ?? e.attributes.user ?? '');
}

/** Lowercased title without a trailing " (2024)" year and collapsed spaces. */
function normTitle(e: HassEntity): string {
  const raw = String(e.attributes.media_title ?? e.attributes.media_series_title ?? '');
  return raw
    .toLowerCase()
    .replace(/\s*\(\d{4}\)\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Whether two active players are the SAME playback. The doubling happens
 * because the Plex integration reports a session AND the playback device's
 * own integration (Android TV / Apple TV / cast) reports the same thing with
 * `app_name: "Plex"` — different content id, no Plex user, a slightly
 * different title ("… (2024)"), but the identical media_duration.
 *
 * Two genuinely different viewers are never merged: distinct non-empty
 * usernames block a match. A device echo has no username, so it still merges
 * into its owning session.
 */
function sameSession(a: HassEntity, b: HassEntity): boolean {
  const ua = user(a);
  const ub = user(b);
  if (ua && ub && ua !== ub) return false; // two distinct users → keep both

  const ca = a.attributes.media_content_id;
  const cb = b.attributes.media_content_id;
  if (ca != null && cb != null && String(ca) === String(cb)) return true;

  const da = num(a.attributes.media_duration);
  const db = num(b.attributes.media_duration);
  if (!(da > 0) || !(db > 0) || Math.abs(da - db) > 5) return false;

  // same-length content: matching (prefix) title, or near-identical position
  const ta = normTitle(a);
  const tb = normTitle(b);
  if (ta && tb && (ta === tb || ta.startsWith(tb) || tb.startsWith(ta))) return true;
  const pa = num(a.attributes.media_position);
  const pb = num(b.attributes.media_position);
  return Number.isFinite(pa) && Number.isFinite(pb) && Math.abs(pa - pb) <= 150;
}

/** Prefer the real Plex session (has user + poster + position) over an echo. */
function infoScore(e: HassEntity): number {
  const a = e.attributes;
  return (
    (user(e) ? 8 : 0) +
    (a.entity_picture ? 4 : 0) +
    (Number.isFinite(num(a.media_position)) ? 2 : 0) +
    Object.keys(a).length / 100
  );
}

/**
 * Collapse entities that represent the same session down to one each,
 * keeping the richest representative (real session over device echo).
 */
export function dedupePlayers(entities: HassEntity[]): HassEntity[] {
  const clusters: HassEntity[][] = [];
  for (const e of entities) {
    const hit = clusters.find((c) => c.some((m) => sameSession(m, e)));
    if (hit) hit.push(e);
    else clusters.push([e]);
  }
  return clusters.map(
    (c) =>
      c.sort(
        (a, b) =>
          ACTIVE_STATES.indexOf(a.state) - ACTIVE_STATES.indexOf(b.state) ||
          infoScore(b) - infoScore(a)
      )[0]
  );
}

/** media_player entities for a now_playing section: explicit list or discovery */
export function findPlayers(hass: HomeAssistant, s: SectionConfig, brandMatch: string): HassEntity[] {
  if (s.players?.length) {
    const listed = s.players
      .map((id) => hass.states[id])
      .filter((e): e is HassEntity => !!e && ACTIVE_STATES.includes(e.state));
    return dedupePlayers(listed);
  }
  const match = (s.match ?? brandMatch).toLowerCase();
  const found = Object.values(hass.states).filter(
    (e) =>
      e.entity_id.startsWith('media_player.') &&
      ACTIVE_STATES.includes(e.state) &&
      (e.entity_id.toLowerCase().includes(match) ||
        String(e.attributes.app_name ?? '').toLowerCase().includes(match) ||
        String(e.attributes.friendly_name ?? '').toLowerCase().includes(match))
  );
  return dedupePlayers(found).sort(
    (a, b) =>
      ACTIVE_STATES.indexOf(a.state) - ACTIVE_STATES.indexOf(b.state) ||
      a.entity_id.localeCompare(b.entity_id)
  );
}

/** "Plex (Plex Web - Microsoft Edge)" → "Plex Web - Microsoft Edge" */
function deviceFromName(friendly?: string): string | undefined {
  if (!friendly) return undefined;
  const m = friendly.match(/\(([^)]+)\)\s*$/);
  return m ? m[1] : friendly;
}

export function toStream(e: HassEntity): StreamInfo {
  const a = e.attributes;
  const type = a.media_content_type as string | undefined;
  let title: string = a.media_title ?? '';
  let subline: string | undefined;

  if (type === 'tvshow' || type === 'episode' || a.media_series_title) {
    title = a.media_series_title ?? title;
    const se =
      a.media_season != null && a.media_episode != null
        ? `S${a.media_season} · E${a.media_episode}`
        : undefined;
    subline = [se, a.media_title].filter(Boolean).join(' · ');
  } else if (type === 'music' || a.media_artist) {
    title = a.media_title ?? '';
    subline = [a.media_artist, a.media_album_name].filter(Boolean).join(' · ');
  } else if (a.media_year) {
    subline = String(a.media_year);
  }

  const updatedRaw = a.media_position_updated_at as string | undefined;
  return {
    entityId: e.entity_id,
    state: e.state as StreamInfo['state'],
    user: a.username ?? a.session_username ?? a.user ?? undefined,
    title: title || (a.friendly_name ?? e.entity_id),
    subline,
    mediaType: type,
    poster: a.entity_picture ?? undefined,
    device: a.app_name ?? deviceFromName(a.friendly_name),
    position: typeof a.media_position === 'number' ? a.media_position : undefined,
    duration: typeof a.media_duration === 'number' ? a.media_duration : undefined,
    positionUpdatedAt: updatedRaw ? Date.parse(updatedRaw) : undefined,
  };
}

/** live position: extrapolate from media_position_updated_at while playing */
export function livePosition(s: StreamInfo): number | undefined {
  if (s.position == null) return undefined;
  if (s.state !== 'playing' || !s.positionUpdatedAt) return s.position;
  const pos = s.position + (Date.now() - s.positionUpdatedAt) / 1000;
  return s.duration != null ? Math.min(pos, s.duration) : pos;
}

/* ---- recently added from a sensor ------------------------------------- */

/**
 * Parses items from a sensor. Understands the upcoming-media-card format
 * (attributes.data array, first entry may be the `title_default` template)
 * plus plain `{title, poster, added}` lists.
 */
export function itemsFromSensor(e?: HassEntity): RecentItem[] {
  if (!e) return [];
  let raw = e.attributes.data ?? e.attributes.items ?? e.attributes.entries;
  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((it) => it && typeof it === 'object' && !('title_default' in it) && (it.title || it.name))
    .map((it): RecentItem => {
      const added = it.added ?? it.aired ?? it.release ?? it.airdate;
      let addedMs: number | undefined;
      if (typeof added === 'number') addedMs = added < 1e12 ? added * 1000 : added;
      else if (typeof added === 'string') {
        const p = Date.parse(added);
        addedMs = Number.isFinite(p) ? p : undefined;
      }
      const se = it.number ?? (it.season != null && it.episode != null ? `S${it.season} · E${it.episode}` : undefined);
      return {
        title: it.title ?? it.name,
        subline: [se, it.episode_title ?? it.episode_name].filter(Boolean).join(' · ') || (it.year ? String(it.year) : undefined),
        poster: it.poster ?? it.thumb ?? it.image ?? it.fanart,
        added: addedMs,
        type: it.type ?? (se ? 'episode' : 'movie'),
      };
    });
}
