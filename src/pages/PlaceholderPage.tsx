interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="w-16 h-16 rounded-2xl bg-[#f3f3ed] border border-[#e5e5de] flex items-center justify-center mb-6">
        <span className="text-2xl">📦</span>
      </div>
      <h1 className="text-2xl font-semibold text-[#0a0a0a] mb-2">{title}</h1>
      <p className="text-sm text-[#0a0a0a]/60 max-w-sm">
        {description ?? `This is where your ${title.toLowerCase()} view will live. More pages coming soon.`}
      </p>
    </div>
  );
}
