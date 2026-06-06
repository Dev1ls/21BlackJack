import { useState, type ReactNode } from 'react';

interface CollapsibleSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({
  title,
  defaultOpen = false,
  children,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-xl border border-gray-700 bg-gray-800/40">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-200"
      >
        {title}
        <span className="text-gray-500">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="border-t border-gray-700 px-4 pb-4 pt-3">{children}</div>}
    </section>
  );
}
