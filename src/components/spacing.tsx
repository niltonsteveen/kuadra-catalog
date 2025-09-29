type StyleKind = "moderno" | "clasico";

type SpacingKey =
  | "null"
  | "xxxs"
  | "xxs"
  | "xs"
  | "s"
  | "m"
  | "l"
  | "xl"
  | "xxl"
  | "xxxl"
  | "4xl"
  | "5xl";

type SpacingToken = {
  label: string;
  key: SpacingKey;
  rem: number;
  pt: number;
};

const SPACING_SCALE: SpacingToken[] = [
  { label: "Null", key: "null", rem: 0, pt: 0 },
  { label: "XXXS", key: "xxxs", rem: 0.125, pt: 2 },
  { label: "XXS", key: "xxs", rem: 0.25, pt: 4 },
  { label: "XS", key: "xs", rem: 0.5, pt: 8 },
  { label: "S", key: "s", rem: 1, pt: 16 },
  { label: "M", key: "m", rem: 1.5, pt: 24 },
  { label: "L", key: "l", rem: 2, pt: 32 },
  { label: "XL", key: "xl", rem: 2.5, pt: 40 },
  { label: "XXL", key: "xxl", rem: 3, pt: 48 },
  { label: "XXXL", key: "xxxl", rem: 3.5, pt: 56 },
  { label: "4XL", key: "4xl", rem: 4, pt: 64 },
  { label: "5XL", key: "5xl", rem: 6, pt: 96 },
];

export function SpacingShowcase({ styleKind }: { styleKind: StyleKind }) {
  const blockShape = styleKind === "clasico" ? "rounded-none" : "rounded-lg";

  return (
    <div className="space-y-6 dark:border-neutral-800 dark:bg-neutral-900">
      <span
        className={`inline-flex text-sm font-semibold uppercase tracking-tight`}
      >
        Spacing/{styleKind === "moderno" ? "Modern" : "Classic"}
      </span>
      <div className="space-y-5">
        {SPACING_SCALE.map((token) => (
          <div
            key={token.key}
            className="flex items-center gap-6 text-sm text-neutral-700 dark:text-neutral-200"
          >
            <div className="w-16 text-xs font-semibold uppercase tracking-[0.3em] text-neutral-500">
              {token.label}
            </div>
            <div
              className={`bg-neutral-500 dark:bg-neutral-300 ${blockShape}`}
              style={{
                width:
                  token.key === "null"
                    ? "4px"
                    : `${Math.min(token.rem * 16, 80)}px`,
                height: "10px",
                minWidth: "4px",
              }}
            />
            <div className="font-mono text-[14px] text-neutral-500">
              {formatPoints(token.pt)} {formatRem(token.rem)}
            </div>
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
