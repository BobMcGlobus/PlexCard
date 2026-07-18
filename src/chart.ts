import { html, svg } from 'lit';
import type { TemplateResult } from 'lit';

export interface ChartOpts {
  /** unique gradient id (two charts on one page must not collide) */
  id: string;
  accent: string;
  height?: number;
  /** draw horizontal grid lines + value labels */
  grid?: boolean;
  /** end-of-line marker dot */
  dot?: boolean;
}

/**
 * Step area chart for integer step signals (stream counts). Steps read truer
 * than smoothed curves — a stream starts and ends abruptly, it doesn't ease.
 */
export function areaChart(samples: number[], opts: ChartOpts): TemplateResult {
  const W = 480;
  const H = opts.height ?? 110;
  const PAD_B = opts.grid ? 16 : 2;
  const top = Math.max(2, Math.ceil(Math.max(...samples, 0)));
  const n = samples.length;
  const x = (i: number) => (n > 1 ? (i / (n - 1)) * W : 0);
  const y = (v: number) => (H - PAD_B) * (1 - Math.max(0, v) / top) + 2;

  let d = `M0 ${y(samples[0] ?? 0)}`;
  for (let i = 1; i < n; i++) d += ` L${x(i)} ${y(samples[i - 1])} L${x(i)} ${y(samples[i])}`;
  const area = `${d} L${W} ${H - PAD_B} L0 ${H - PAD_B} Z`;

  const gridVals: number[] = [];
  if (opts.grid) {
    const stepV = top <= 6 ? 1 : Math.ceil(top / 4);
    for (let v = stepV; v <= top; v += stepV) gridVals.push(v);
  }

  return html`
    <svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none">
      <defs>
        <linearGradient id=${opts.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color=${opts.accent} stop-opacity="0.45" />
          <stop offset="1" stop-color=${opts.accent} stop-opacity="0.02" />
        </linearGradient>
      </defs>
      ${gridVals.map(
        (v) => svg`<line class="grid" x1="0" y1=${y(v)} x2=${W} y2=${y(v)} />
          <text class="gridlabel" x="4" y=${y(v) - 3}>${v}</text>`
      )}
      <path d=${area} fill="url(#${opts.id})" />
      <path d=${d} fill="none" stroke=${opts.accent} stroke-width="2" vector-effect="non-scaling-stroke" />
      ${opts.dot !== false
        ? svg`<circle cx=${W} cy=${y(samples[n - 1] ?? 0)} r="3.5" fill=${opts.accent} />`
        : nothing()}
    </svg>
  `;
}

function nothing() {
  return svg``;
}
