import CategorySection from "./section.client";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ tenant: string; category: string }>;
}) {
  const { tenant, category } = await params;
  return (
    <section className="w-9/12 mx-auto pt-[88px] pb-[200px]">
      <CategorySection title={category} />
    </section>
  );
}
