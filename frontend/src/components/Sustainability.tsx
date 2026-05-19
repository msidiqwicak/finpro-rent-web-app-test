export default function Sustainability() {
  return (
    <section className="py-20 px-margin-mobile md:px-margin-tablet lg:px-margin-desktop bg-surface-container-low">
      <div className="max-w-[var(--spacing-container-max)] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="rounded-2xl overflow-hidden shadow-sm h-[400px]">
          <img 
            alt="Traveler planting a tree" 
            className="w-full h-full object-cover" 
            src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop"
          />
        </div>
        <div className="space-y-6">
          <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center mb-6">
            <span className="text-xl text-on-secondary-container">🌳</span>
          </div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Traveling with a Conscience.</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            For every booking, we plant a tree to restore local ecosystems. We believe that exploration shouldn't come at the cost of the environment. Our curated properties meet strict sustainability standards, ensuring your stay leaves a positive impact.
          </p>
          <button className="mt-4 border-2 border-secondary text-primary-container px-8 py-3 rounded-full font-label-md text-label-md hover:bg-secondary/10 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
}
