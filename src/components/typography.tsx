import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
  CSSProperties,
} from "react";
import {
  TYPOGRAPHY_SIZE_MAP,
  TYPOGRAPHY_SIZES,
  type TypographySize,
} from "../design-tokens/typography";

export type TypographyWeight =
  | "thin"
  | "extralight"
  | "light"
  | "regular"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black";

export type TypographyStyleKind = "moderno" | "clasico";

const WEIGHT_MAP: Record<TypographyWeight, number> = {
  thin: 100,
  extralight: 200,
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

const FONT_FAMILY_BY_STYLE: Record<TypographyStyleKind, string> = {
  moderno: "var(--kuadra-font-sans)",
  clasico: "var(--kuadra-font-mono)",
};

export const TYPOGRAPHY_WEIGHTS: TypographyWeight[] = [
  "thin",
  "extralight",
  "light",
  "regular",
  "medium",
  "semibold",
  "bold",
  "extrabold",
  "black",
];

type TypographyProps<T extends ElementType> = {
  as?: T;
  size: TypographySize;
  weight?: TypographyWeight;
  styleKind?: TypographyStyleKind;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export function Typography<T extends ElementType = "p">({
  as,
  size,
  weight = "regular",
  styleKind = "moderno",
  className,
  style,
  children,
  ...props
}: TypographyProps<T>) {
  const Component = (as ?? "p") as ElementType;
  const mergedClassName = [
    "leading-tight text-neutral-900 dark:text-neutral-100",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inlineStyle: CSSProperties = {
    ...(style ?? {}),
    fontFamily: FONT_FAMILY_BY_STYLE[styleKind],
    fontSize: TYPOGRAPHY_SIZE_MAP[size].fontSize,
    lineHeight: TYPOGRAPHY_SIZE_MAP[size].lineHeight,
    fontWeight: WEIGHT_MAP[weight],
  };

  return (
    <Component className={mergedClassName} style={inlineStyle} {...props}>
      {children}
    </Component>
  );
}

const PREVIEW_TEXT = "Playing with fonts is fun";

const WEIGHTS_PREVIEW: TypographyWeight[] = ["regular", "bold"];

export function TypographyShowcase({
  styleKind,
}: {
  styleKind: TypographyStyleKind;
}) {
  return (
    <div className="space-y-6 p-6 dark:border-neutral-800 dark:bg-neutral-900">
      <span className="inline-flex items-center justify-center rounded-full bg-neutral-200 px-3 py-1 text-xs font-semibold uppercase tracking-tight text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
        Typo/{styleKind === "moderno" ? "Modern" : "Classic"}
      </span>
      <div className="space-y-6">
        {TYPOGRAPHY_SIZES.map((size) => (
          <div key={size} className="space-y-1">
            <div
              className="text-xs font-medium uppercase text-neutral-500"
              style={{ letterSpacing: "0.3em" }}
            >
              {size.toUpperCase()}
            </div>
            {WEIGHTS_PREVIEW.map((weight) => (
              <Typography
                key={weight}
                size={size}
                weight={weight}
                styleKind={styleKind}
              >
                {PREVIEW_TEXT}
              </Typography>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
