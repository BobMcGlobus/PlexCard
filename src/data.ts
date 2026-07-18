import type { HassEntity, HomeAssistant, RecentItem, SectionConfig, StreamInfo } from './types';

/** also the sort order in the stream list (active first) */
const ACTIVE_STATES = ['playing', 'buffering', 'paused'];

/** media_player entities for a now_playing section: explicit list or discovery */
export function findPlayers(hass: HomeAssistant, s: SectionConfig, brandMatch: string): HassEntity[] {
  if (s.players?.length) {
    return s.players
      .map((id) => hass.states[id])
      .filter((e): e is HassEntity => !!e && ACTIVE_STATES.includes(e.state));
  }
  const match = (s.match ?? brandMatch).toLowerCase();
  return Object.values(hass.states)
    .filter(
      (e) =>
        e.entity_id.startsWith('media_player.') &&
        ACTIVE_STATES.includes(e.state) &&
        (e.entity_id.toLowerCase().includes(match) ||
          String(e.attributes.app_name ?? '').toLowerCase().includes(match) ||
          String(e.attributes.friendly_name ?? '').toLowerCase().includes(match))
    )
    .sort(
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
