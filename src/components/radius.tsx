type StyleKind = "moderno" | "clasico";

type RadiusKey = "null" | "xs" | "s" | "m" | "l" | "full";

type RadiusToken = {
  label: string;
  key: RadiusKey;
  rem: number;
  pt: number;
};

const RADIUS_CLASS_MAP: Record<RadiusKey, string> = {
  null: "rounded-radius-null",
  xs: "rounded-radius-xs",
  s: "rounded-radius-s",
  m: "rounded-radius-m",
  l: "rounded-radius-l",
  full: "rounded-radius-full",
};

const RADIUS_SCALE: RadiusToken[] = [
  { label: "Null", key: "null", rem: 0, pt: 0 },
  { label: "XS", key: "xs", rem: 0.5, pt: 8 },
  { label: "S", key: "s", rem: 1, pt: 16 },
  { label: "M", key: "m", rem: 1.5, pt: 24 },
  { label: "L", key: "l", rem: 2.5, pt: 40 },
  { label: "Full", key: "full", rem: 6.25, pt: 100 },
];

export function RadiusShowcase({ styleKind }: { styleKind: StyleKind }) {
  const tileTone =
    styleKind === "clasico"
      ? "bg-neutral-500/90 dark:bg-neutral-600"
      : "bg-neutral-500 dark:bg-neutral-300";

  return (
    <div className="space-y-6 dark:border-neutral-800 dark:bg-neutral-900">
      <span
        className={`inline-flex min-w-[120px] items-center justify-center text-sm font-semibold uppercase tracking-tight `}
      >
        Radius/{styleKind === "moderno" ? "Modern" : "Classic"}
      </span>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {RADIUS_SCALE.map((token) => (
          <div
            key={token.key}
            className="space-y-3 text-sm text-neutral-700 dark:text-neutral-200"
          >
            <div className="space-y-1">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
                {token.label}
              </div>
              <div className="font-mono text-[11px] text-neutral-500">
                {formatPoints(token.pt)}
              </div>
              <div className="font-mono text-[11px] text-neutral-500">
                {formatRem(token.rem)}
              </div>
            </div>
            <div
              className={`${tileTone} ${
                RADIUS_CLASS_MAP[token.key]
              } h-20 w-full`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function formatPoints(value: number) {
  if (value === 0) return "0 pt";
  const raw = value.toString();
  return `${raw.length === 1 ? raw.padStart(2, "0") : raw} pt`;
}

function formatRem(value: number) {
  if (value === 0) return "0 rem";
  return `${value.toFixed(2)} rem`;
}
