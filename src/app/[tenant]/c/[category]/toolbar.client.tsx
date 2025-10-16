"use client";
import { Divider } from "@/components/ui/divider";
import { Typography } from "@/components/typography";
import { IconButton } from "@/components/ui/icon-button";
import React from "react";

function ColumnsIcon({ cols }: { cols: 2 | 3 | 4 }) {
  const bars = Array.from({ length: cols });
  return (
    <span className="inline-flex items-center gap-0.5 text-current">
      {bars.map((_, i) => (
        <span key={i} className="block h-3 w-1 rounded bg-current" />
      ))}
    </span>
  );
}

export default function CategoryToolbar({
  title,
  onChange,
}: {
  title: string;
  onChange?: (cols: 2 | 3 | 4) => void;
}) {
  const [cols, setCols] = React.useState<2 | 3 | 4>(4);
  const set = (n: 2 | 3 | 4) => {
    setCols(n);
    onChange?.(n);
  };
  return (
    <div className="w-full mt-4xl">
      <Divider size="s" />
      <div className="flex items-center justify-between py-s">
        <Typography size="l" weight="bold">
          {title}
        </Typography>
        <div className="flex items-center gap-m">
          <Typography size="s" weight="bold">
            Ver
          </Typography>
          <div className="flex items-center gap-xs">
            <IconButton
              aria-label="4 columnas"
              variant={cols === 4 ? "default" : "secondary"}
              onClick={() => set(4)}
            >
              <ColumnsIcon cols={4} />
            </IconButton>
            <IconButton
              aria-label="3 columnas"
              variant={cols === 3 ? "default" : "secondary"}
              onClick={() => set(3)}
            >
              <ColumnsIcon cols={3} />
            </IconButton>
            <IconButton
              aria-label="2 columnas"
              variant={cols === 2 ? "default" : "secondary"}
              onClick={() => set(2)}
            >
              <ColumnsIcon cols={2} />
            </IconButton>
          </div>
        </div>
      </div>
      <Divider size="s" />
    </div>
  );
}
