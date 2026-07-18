import type { HomeAssistant } from './types';

export function locale(hass?: HomeAssistant): string {
  return hass?.locale?.language ?? hass?.language ?? 'en';
}

export function fmtNumber(v: number, hass?: HomeAssistant, precision = 0): string {
  if (!Number.isFinite(v)) return '–';
  return v.toLocaleString(locale(hass), {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  });
}

/** Bytes (or a value with `unit` GB/MB/…) → shortest sensible unit */
export function fmtBytes(v: number, hass?: HomeAssistant, unit?: string): string {
  if (!Number.isFinite(v)) return '–';
  const factors: Record<string, number> = {
    b: 1,
    kb: 1e3,
    mb: 1e6,
    gb: 1e9,
    tb: 1e12,
  };
  let bytes = v * (factors[(unit ?? 'b').toLowerCase()] ?? 1);
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  let i = 0;
  while (bytes >= 1000 && i < units.length - 1) {
    bytes /= 1000;
    i++;
  }
  return `${fmtNumber(bytes, hass, bytes >= 100 ? 0 : 1)} ${units[i]}`;
}

/** kbps → "8,4 Mbps" */
export function fmtBitrate(kbps: number, hass?: HomeAssistant): string {
  if (!Number.isFinite(kbps)) return '–';
  if (kbps >= 1000) return `${fmtNumber(kbps / 1000, hass, 1)} Mbps`;
  return `${fmtNumber(kbps, hass, 0)} kbps`;
}

/** seconds → "1:52:03" / "23:10" */
export function fmtClock(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const s = Math.floor(sec % 60);
  const m = Math.floor((sec / 60) % 60);
  const h = Math.floor(sec / 3600);
  const mm = h ? String(m).padStart(2, '0') : String(m);
  return `${h ? `${h}:` : ''}${mm}:${String(s).padStart(2, '0')}`;
}

/** minutes → "7 h 12 min" */
export function fmtDuration(minutes: number, hass?: HomeAssistant): string {
  if (!Number.isFinite(minutes)) return '–';
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (!h) return `${m} min`;
  if (!m) return `${fmtNumber(h, hass)} h`;
  return `${fmtNumber(h, hass)} h ${m} min`;
}

/** epoch ms → relative "vor 3 Std." / "in 2 Tagen" via Intl */
export function fmtAgo(t: number, hass?: HomeAssistant): string {
  if (!Number.isFinite(t)) return '';
  const rtf = new Intl.RelativeTimeFormat(locale(hass), { numeric: 'auto' });
  const diff = (t - Date.now()) / 1000;
  const abs = Math.abs(diff);
  if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour');
  if (abs < 86400 * 30) return rtf.format(Math.round(diff / 86400), 'day');
  return new Date(t).toLocaleDateString(locale(hass), {
    day: 'numeric',
    month: 'short',
  });
}
