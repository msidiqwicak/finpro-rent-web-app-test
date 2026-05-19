const categories = [
  { name: 'Forest', icon: '🌲' },
  { name: 'Mountain', icon: '⛰️' },
  { name: 'Waterfall', icon: '💦' },
  { name: 'Meadow', icon: '🌿' },
  { name: 'Eco-Farm', icon: '🏡' },
];

export default function CategoryFilter() {
  return (
    <section className="py-12 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop max-w-[var(--spacing-container-max)] mx-auto border-b border-surface-container-high">
      <div className="flex flex-wrap justify-center gap-8 md:gap-16">
        {categories.map((cat) => (
          <button key={cat.name} className="flex flex-col items-center gap-2 group">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary-container transition-colors duration-300">
              <span className="text-3xl text-on-surface-variant group-hover:text-on-primary-container">{cat.icon}</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant group-hover:text-primary transition-colors">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
