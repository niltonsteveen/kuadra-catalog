export type TypographySize =
  | "xxxs"
  | "xxs"
  | "xs"
  | "s"
  | "m"
  | "l"
  | "xl"
  | "xxl"
  | "xxxl"
  | "4xl";

export const TYPOGRAPHY_SIZE_MAP: Record<
  TypographySize,
  { fontSize: string; lineHeight: string }
> = {
  xxxs: { fontSize: "10px", lineHeight: "1.25" },
  xxs: { fontSize: "13px", lineHeight: "1.25" },
  xs: { fontSize: "16px", lineHeight: "1.25" },
  s: { fontSize: "20px", lineHeight: "1.25" },
  m: { fontSize: "25px", lineHeight: "1.25" },
  l: { fontSize: "31px", lineHeight: "1.25" },
  xl: { fontSize: "39px", lineHeight: "1.25" },
  xxl: { fontSize: "49px", lineHeight: "1.25" },
  xxxl: { fontSize: "61px", lineHeight: "1.25" },
  "4xl": { fontSize: "76px", lineHeight: "1.25" },
};

export const TYPOGRAPHY_SIZES: TypographySize[] = [
  "4xl",
  "xxxl",
  "xxl",
  "xl",
  "l",
  "m",
  "s",
  "xs",
  "xxs",
  "xxxs",
];
