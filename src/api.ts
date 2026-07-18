import type { RecentItem } from './types';

/** Overseerr/Jellyseerr /api/v1/request/count response */
export interface RequestCounts {
  total?: number;
  movie?: number;
  tv?: number;
  pending?: number;
  approved?: number;
  declined?: number;
  processing?: number;
  available?: number;
}

const strip = (url: string) => url.replace(/\/+$/, '');

/* ---- Plex -------------------------------------------------------------- */

interface PlexMeta {
  title?: string;
  grandparentTitle?: string;
  parentTitle?: string;
  parentIndex?: number;
  index?: number;
  type?: string;
  year?: number;
  addedAt?: number;
  thumb?: string;
  parentThumb?: string;
  grandparentThumb?: string;
}

export function plexImage(base: string, token: string, thumb: string, width = 320, height = 480): string {
  return (
    `${strip(base)}/photo/:/transcode?width=${width}&height=${height}&minSize=1&upscale=1` +
    `&url=${encodeURIComponent(thumb)}&X-Plex-Token=${encodeURIComponent(token)}`
  );
}

export async function fetchPlexRecentlyAdded(
  base: string,
  token: string,
  limit: number
): Promise<RecentItem[]> {
  const url =
    `${strip(base)}/library/recentlyAdded?X-Plex-Container-Start=0` +
    `&X-Plex-Container-Size=${limit}&X-Plex-Token=${encodeURIComponent(token)}`;
  const resp = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!resp.ok) throw new Error(`Plex ${resp.status}`);
  const json = await resp.json();
  const meta: PlexMeta[] = json?.MediaContainer?.Metadata ?? [];
  return meta.slice(0, limit).map((m): RecentItem => {
    const isEp = m.type === 'episode' || m.type === 'season';
    const title = (isEp ? m.grandparentTitle ?? m.parentTitle : m.title) ?? m.title ?? '';
    const se =
      m.type === 'episode' && m.parentIndex != null && m.index != null
        ? `S${m.parentIndex} · E${m.index}`
        : m.type === 'season'
          ? m.title
          : undefined;
    const thumb = (isEp ? m.grandparentThumb ?? m.parentThumb ?? m.thumb : m.thumb) ?? m.thumb;
    return {
      title,
      subline: se ?? (m.year ? String(m.year) : undefined),
      poster: thumb ? plexImage(base, token, thumb) : undefined,
      added: m.addedAt ? m.addedAt * 1000 : undefined,
      type: m.type,
    };
  });
}

/* ---- Jellyfin ----------------------------------------------------------- */

interface JellyfinItem {
  Id?: string;
  Name?: string;
  SeriesName?: string;
  ParentIndexNumber?: number;
  IndexNumber?: number;
  Type?: string;
  ProductionYear?: number;
  DateCreated?: string;
  ImageTags?: { Primary?: string };
  SeriesId?: string;
  SeriesPrimaryImageTag?: string;
}

export async function fetchJellyfinRecentlyAdded(
  base: string,
  apiKey: string,
  limit: number,
  userId?: string
): Promise<RecentItem[]> {
  const b = strip(base);
  const url = userId
    ? `${b}/Users/${encodeURIComponent(userId)}/Items/Latest?Limit=${limit}&Fields=DateCreated`
    : `${b}/Items?SortBy=DateCreated&SortOrder=Descending&Recursive=true&Limit=${limit}` +
      `&IncludeItemTypes=Movie,Series,Episode&Fields=DateCreated`;
  const resp = await fetch(url, {
    headers: { Accept: 'application/json', 'X-Emby-Token': apiKey },
  });
  if (!resp.ok) throw new Error(`Jellyfin ${resp.status}`);
  const json = await resp.json();
  const items: JellyfinItem[] = Array.isArray(json) ? json : (json?.Items ?? []);
  return items.slice(0, limit).map((it): RecentItem => {
    const isEp = it.Type === 'Episode';
    const imgId = isEp && it.SeriesPrimaryImageTag ? it.SeriesId : it.Id;
    const tag = isEp && it.SeriesPrimaryImageTag ? it.SeriesPrimaryImageTag : it.ImageTags?.Primary;
    const se =
      isEp && it.ParentIndexNumber != null && it.IndexNumber != null
        ? `S${it.ParentIndexNumber} · E${it.IndexNumber}`
        : undefined;
    return {
      title: (isEp ? it.SeriesName : it.Name) ?? it.Name ?? '',
      subline: se ?? (it.ProductionYear ? String(it.ProductionYear) : undefined),
      poster: tag ? `${b}/Items/${imgId}/Images/Primary?maxWidth=320&tag=${tag}&api_key=${encodeURIComponent(apiKey)}` : undefined,
      added: it.DateCreated ? Date.parse(it.DateCreated) : undefined,
      type: it.Type?.toLowerCase(),
    };
  });
}

/* ---- Overseerr / Jellyseerr --------------------------------------------- */

export async function fetchSeerrCounts(base: string, apiKey: string): Promise<RequestCounts> {
  const resp = await fetch(`${strip(base)}/api/v1/request/count`, {
    headers: { Accept: 'application/json', 'X-Api-Key': apiKey },
  });
  if (!resp.ok) throw new Error(`Overseerr ${resp.status}`);
  return (await resp.json()) as RequestCounts;
}
