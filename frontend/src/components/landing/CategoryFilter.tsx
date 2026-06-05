import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { name: 'All Category', icon: 'grid_view'   },
  { name: 'Home',         icon: 'cottage'      },
  { name: 'Apartment',    icon: 'apartment'    },
  { name: 'Hotel',        icon: 'hotel'        },
  { name: 'Villa',        icon: 'villa'        },
];

interface CategoryItemProps {
  name:    string;
  icon:    string;
  onClick: () => void;
}

function CategoryItem({ name, icon, onClick }: CategoryItemProps) {
  return (
    <button
      aria-label={`Filter by ${name}`}
      onClick={onClick}
      className="group flex flex-col items-center gap-2.5 bg-transparent border-none cursor-pointer px-2 py-1 rounded-xl transition-transform duration-200 hover:-translate-y-1"
    >
      <div className="w-16 h-16 rounded-full border border-transparent flex items-center justify-center transition-all duration-200 ease-in-out bg-surface-high group-hover:bg-secondary-container group-hover:border-secondary group-hover:shadow-md">
        <span className="material-symbols-outlined text-[28px] text-on-surface-variant group-hover:text-on-secondary-container transition-colors duration-200 [font-variation-settings:'FILL'_0,'wght'_300,'GRAD'_0,'opsz'_24]">
          {icon}
        </span>
      </div>
      <span className="font-body text-[13px] font-semibold text-on-surface-variant tracking-[0.02em] group-hover:text-primary transition-colors">
        {name}
      </span>
    </button>
  );
}

export default function CategoryFilter() {
  const navigate = useNavigate();

  const handleClick = (categoryName: string) => {
    if (categoryName === 'All Category') {
      navigate('/explore');
    } else {
      navigate(`/explore?category=${encodeURIComponent(categoryName)}`);
    }
  };

  return (
    <section aria-label="Property categories">
      <div className="max-w-[1280px] mx-auto px-5 py-9 md:px-8 lg:px-16">
        <hr className="border-none border-t border-surface-high mb-8" />
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          {CATEGORIES.map((cat) => (
            <CategoryItem
              key={cat.name}
              name={cat.name}
              icon={cat.icon}
              onClick={() => handleClick(cat.name)}
            />
          ))}
        </div>
        <hr className="border-none border-t border-surface-high mt-8" />
      </div>
    </section>
  );
}
