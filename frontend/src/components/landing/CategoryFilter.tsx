const CATEGORIES = [
  { name: 'Forest',    icon: 'forest'      },
  { name: 'Mountain',  icon: 'landscape'   },
  { name: 'Waterfall', icon: 'water_drop'  },
  { name: 'Meadow',    icon: 'grass'       },
  { name: 'Eco-Farm',  icon: 'agriculture' },
];

function CategoryItem({ name, icon }: { name: string; icon: string }) {
  return (
    <button aria-label={`Filter by ${name}`}
      className="group flex flex-col items-center gap-2.5 bg-transparent border-none cursor-pointer px-2 py-1 rounded-xl transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="w-16 h-16 rounded-full bg-surface-high border border-transparent flex items-center justify-center transition-all duration-200 ease-in-out group-hover:bg-secondary-container group-hover:border-secondary">
        <span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-secondary-container transition-colors duration-200 [font-variation-settings:'FILL'_0,'wght'_300,'GRAD'_0,'opsz'_24]">
          {icon}
        </span>
      </div>
      <span className="font-body text-[13px] font-semibold text-on-surface-variant tracking-[0.02em]">{name}</span>
    </button>
  );
}

export default function CategoryFilter() {
  return (
    <section aria-label="Property categories">
      <div className="max-w-[1280px] mx-auto px-5 py-9 md:px-8 lg:px-16">
        <hr className="border-none border-t border-surface-high mb-8" />
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4">
          {CATEGORIES.map(cat => <CategoryItem key={cat.name} {...cat} />)}
        </div>
        <hr className="border-none border-t border-surface-high mt-8" />
      </div>
    </section>
  );
}
