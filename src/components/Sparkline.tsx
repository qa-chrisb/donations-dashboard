type Props = {
  values: number[]; // major units (e.g., 12.34)
  width?: number;
  height?: number;
  stroke?: string;
};

export default function Sparkline({
  values,
  width = 140,
  height = 34,
  stroke = "#10b981",
}: Props) {
  if (!values || values.length === 0) {
    return (
      <svg width={width} height={height} role="img" aria-label="No data">
        <rect
          x="0"
          y="0"
          width={width}
          height={height}
          fill="currentColor"
          opacity="0.06"
        />
      </svg>
    );
  }

  const w = width,
    h = height,
    pad = 2;
  const xs = values.map(
    (_, i) => (i / Math.max(1, values.length - 1)) * (w - pad * 2) + pad,
  );
  const min = Math.min(...values),
    max = Math.max(...values);
  const span = max - min || 1;
  const ys = values.map((v) => h - pad - ((v - min) / span) * (h - pad * 2));

  const d = xs.map((x, i) => `${i ? "L" : "M"}${x},${ys[i]}`).join(" ");
  return (
    <svg width={w} height={h} role="img" aria-label="Sparkline">
      <path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
