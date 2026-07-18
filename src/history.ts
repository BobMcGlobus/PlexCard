import type { HomeAssistant } from './types';

export interface HistoryPoint {
  /** epoch millis */
  t: number;
  v: number;
}

interface WsHistoryState {
  s: string;
  lu: number;
}

/** Recorder history for one entity via the websocket API (numeric states only). */
export async function fetchHistory(
  hass: HomeAssistant,
  entityId: string,
  hours: number
): Promise<HistoryPoint[]> {
  const end = new Date();
  const start = new Date(end.getTime() - hours * 3600000);
  const resp = await hass.callWS<Record<string, WsHistoryState[]>>({
    type: 'history/history_during_period',
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    entity_ids: [entityId],
    minimal_response: true,
    no_attributes: true,
  });
  return (resp?.[entityId] ?? [])
    .map((p) => ({ t: p.lu * 1000, v: parseFloat(p.s) }))
    .filter((p) => Number.isFinite(p.v));
}

/**
 * Daily long-term statistics (max, falling back to mean) — unlike recorder
 * history these survive the purge window, so 30/90-day ranges keep working.
 */
export async function fetchStatsDaily(
  hass: HomeAssistant,
  entityId: string,
  days: number
): Promise<HistoryPoint[]> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  const resp = await hass.callWS<Record<string, Record<string, unknown>[]>>({
    type: 'recorder/statistics_during_period',
    start_time: start.toISOString(),
    end_time: new Date().toISOString(),
    statistic_ids: [entityId],
    period: 'day',
    types: ['max', 'mean'],
  });
  return (resp?.[entityId] ?? [])
    .map((r) => ({
      t: typeof r.start === 'number' ? r.start : Date.parse(String(r.start)),
      v:
        typeof r.max === 'number'
          ? r.max
          : typeof r.mean === 'number'
            ? r.mean
            : NaN,
    }))
    .filter((p) => Number.isFinite(p.t) && Number.isFinite(p.v));
}

/**
 * Series for an activity range: raw recorder history up to 7 days, daily
 * long-term statistics beyond that (with a history fallback for sensors
 * that record no statistics).
 */
export async function fetchSeries(
  hass: HomeAssistant,
  entityId: string,
  hours: number
): Promise<HistoryPoint[]> {
  if (hours <= 168) return fetchHistory(hass, entityId, hours);
  const stats = await fetchStatsDaily(hass, entityId, hours / 24).catch(
    () => [] as HistoryPoint[]
  );
  if (stats.length) return stats;
  return fetchHistory(hass, entityId, hours);
}

/**
 * Step-samples the history onto `n` evenly spaced buckets over the last
 * `hours` hours (max per bucket; stream counts are step signals, the peak
 * matters). Empty leading buckets carry the previous known value.
 */
export function sampleSteps(points: HistoryPoint[], hours: number, n: number): number[] {
  const end = Date.now();
  const start = end - hours * 3600000;
  const out = new Array<number>(n).fill(NaN);
  const sorted = [...points].sort((a, b) => a.t - b.t);
  // value carried into the window from before its start
  let carry = 0;
  for (const p of sorted) {
    if (p.t < start) carry = p.v;
    else {
      const idx = Math.min(n - 1, Math.floor(((p.t - start) / (end - start)) * n));
      out[idx] = Number.isFinite(out[idx]) ? Math.max(out[idx], p.v) : p.v;
    }
  }
  let last = carry;
  for (let i = 0; i < n; i++) {
    if (Number.isFinite(out[i])) last = out[i];
    else out[i] = last;
  }
  return out;
}
