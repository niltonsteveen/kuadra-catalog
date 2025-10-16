"use client";
import React from "react";
import CategoryToolbar from "./toolbar.client";
import ProductsGrid from "./products-grid.client";

export default function CategorySection({ title }: { title: string }) {
  const [cols, setCols] = React.useState<2 | 3 | 4>(4);
  return (
    <div className="flex flex-col gap-l">
      <CategoryToolbar title={title} onChange={setCols} />
      <ProductsGrid cols={cols} />
    </div>
  );
}
