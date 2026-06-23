import { Link } from 'react-router-dom';

export default function Sustainability() {
  return (
    <section aria-label="Our sustainability mission" className="bg-surface-low">
      <div className="max-w-[1280px] mx-auto px-5 py-16 md:px-8 lg:px-16">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          <div className="rounded-2xl overflow-hidden aspect-[16/10] relative shrink-0">
            <img
              src="https://res.cloudinary.com/dpxovlms4/image/upload/v1779440988/finpro/assets/sustainability.jpg"
              alt="Person planting a tree in a forest"
              className="w-full h-full object-cover block"
            />
          </div>

          <div className="flex flex-col gap-6 pl-[2%]">
            <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-on-secondary-container">park</span>
            </div>

            <h2 className="font-display text-[clamp(24px,3.5vw,32px)] font-semibold text-on-surface mt-2">
              Traveling with a Conscience.
            </h2>

            <p className="font-body text-[18px] leading-relaxed text-on-surface-variant">
              For every booking, we plant a tree to restore local ecosystems. We believe that exploration shouldn't come at the cost of the environment. Our curated properties meet strict sustainability standards, ensuring your stay leaves a positive impact.
            </p>

            <div className="mt-2">
              <Link to="/sustainability" className="inline-flex items-center border-2 border-secondary text-primary-container bg-transparent rounded-full px-6 py-2.5 font-body font-semibold text-[14px] cursor-pointer hover:bg-secondary/10 transition-colors duration-200">
                Learn More
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
