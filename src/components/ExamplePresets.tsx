"use client";

interface ExampleOption {
  id: string;
  label: string;
  description: string;
}

export function ExamplePresets({
  options,
  onSelect,
}: {
  options: ExampleOption[];
  onSelect: (id: string) => void;
}) {
  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
        Ejemplos listos
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            title={option.description}
            onClick={() => onSelect(option.id)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-left transition hover:border-[#E65100] hover:text-[#E65100]"
          >
            <span className="block text-xs font-bold">{option.label}</span>
            <span className="mt-0.5 block max-w-44 text-[11px] leading-4 text-slate-500">
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
