export type StickyHeaderProps = {
  text: string;
};

export function StickyHeader({ text }: StickyHeaderProps) {
  return (
    <div className="sticky top-0 z-30 w-full bg-primary-300 text-white typo-xs font-medium px-m lg:px-xl py-xxs flex items-center justify-center modern:rounded-none classic:rounded-none">
      <span className="max-w-screen-xl text-center leading-tight">{text}</span>
    </div>
  );
}
