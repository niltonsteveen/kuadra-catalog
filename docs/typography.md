# Typography System

This document describes the typography system in Kuadra Catalog, including the `Typography` component and global utility classes for font sizes.

## Typography Component

The `Typography` component provides a consistent way to apply typography styles with predefined sizes, weights, and style kinds.

### Props

- `size`: TypographySize - The font size (e.g., "m", "xl")
- `weight`: TypographyWeight - The font weight (e.g., "regular", "bold")
- `styleKind`: TypographyStyleKind - The font family style ("moderno" for sans-serif, "clasico" for mono)
- `as`: ElementType - The HTML element to render (default: "p")
- `children`: ReactNode - The content
- Other standard HTML props

### Example Usage

```tsx
import { Typography } from "@/components/typography";

// Basic usage
<Typography size="m" weight="medium">
  This is medium text
</Typography>

// With custom element and style
<Typography as="h1" size="xxl" weight="bold" styleKind="moderno">
  Heading
</Typography>
```

## Global Utility Classes

In addition to the component, global utility classes are available for direct application to any element. These classes apply only font-size and line-height, matching the component's defaults.

### Available Classes

- `.typo-xxxs` - 10px
- `.typo-xxs` - 13px
- `.typo-xs` - 16px
- `.typo-s` - 20px
- `.typo-m` - 25px
- `.typo-l` - 31px
- `.typo-xl` - 39px
- `.typo-xxl` - 49px
- `.typo-xxxl` - 61px
- `.typo-4xl` - 76px

All classes include `line-height: 1.25` (equivalent to Tailwind's `leading-tight`).

### Example Usage

```tsx
// Using utility classes directly
<button className="typo-m font-semibold text-primary-900">
  Buy Now
</button>

<h2 className="typo-xxl font-medium">
  Section Title
</h2>

// Combining with other utilities
<p className="typo-s font-regular text-neutral-700 leading-tight">
  Description text
</p>
```

### Mapping

| Size Prop | Utility Class | Font Size | Line Height |
| --------- | ------------- | --------- | ----------- |
| xxxs      | .typo-xxxs    | 10px      | 1.25        |
| xxs       | .typo-xxs     | 13px      | 1.25        |
| xs        | .typo-xs      | 16px      | 1.25        |
| s         | .typo-s       | 20px      | 1.25        |
| m         | .typo-m       | 25px      | 1.25        |
| l         | .typo-l       | 31px      | 1.25        |
| xl        | .typo-xl      | 39px      | 1.25        |
| xxl       | .typo-xxl     | 49px      | 1.25        |
| xxxl      | .typo-xxxl    | 61px      | 1.25        |
| 4xl       | .typo-4xl     | 76px      | 1.25        |

Note: For font weights, use standard Tailwind utilities like `font-medium`, `font-bold`, etc. Font family can be controlled with `font-sans` or `font-mono` if needed.
