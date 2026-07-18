import type { Brand } from './types';

export interface BrandTheme {
  accent: string;
  accent2: string;
  /** default substring for media_player auto-discovery */
  match: string;
}

export const BRANDS: Record<Brand, BrandTheme> = {
  plex: { accent: '#e5a00d', accent2: '#f7c247', match: 'plex' },
  jellyfin: { accent: '#a85cc3', accent2: '#00a4dc', match: 'jellyfin' },
  emby: { accent: '#52b54b', accent2: '#7fd478', match: 'emby' },
  tautulli: { accent: '#dba81a', accent2: '#889df1', match: 'plex' },
  neutral: {
    accent: 'var(--primary-color)',
    accent2: 'var(--accent-color, var(--primary-color))',
    match: 'plex',
  },
};

/** Resolve a brand theme with an optional accent override. */
export function brandTheme(brand?: Brand, accent?: string): BrandTheme {
  const b = BRANDS[brand ?? 'plex'] ?? BRANDS.plex;
  return accent ? { ...b, accent, accent2: accent } : b;
}
