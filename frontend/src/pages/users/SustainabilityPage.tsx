import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function SustainabilityPage() {
  return (
    <>
      <Navbar />
      <main className="bg-surface-low min-h-screen">
        
        {/* HERO SECTION */}
        <section className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center">
          {/* Background Image using the provided Cloudinary asset */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://res.cloudinary.com/dpxovlms4/image/upload/v1779440988/finpro/assets/sustainability.jpg" 
              alt="Lush green forest representing sustainability" 
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
          </div>

          <div className="relative z-10 text-center px-5 max-w-4xl mx-auto text-white mt-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-[13px] font-bold uppercase tracking-widest mb-6">
              <span className="material-symbols-outlined text-[16px]">eco</span>
              Our Mission
            </span>
            <h1 className="font-display font-extrabold text-[clamp(40px,6vw,64px)] leading-tight mb-6">
              Travel With Purpose.
            </h1>
            <p className="font-body text-[clamp(16px,2vw,20px)] leading-relaxed text-white/90 max-w-3xl mx-auto">
              For every booking, we plant a tree to restore local ecosystems. We believe that exploration shouldn't come at the cost of the environment. Our curated properties meet strict sustainability standards, ensuring your stay leaves a positive impact.
            </p>
          </div>
        </section>

        {/* PILLARS SECTION */}
        <section className="py-24 px-5 md:px-8 lg:px-16 max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface mb-4">How We Make a Difference</h2>
            <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
              We partner with local communities and environmental organizations to ensure your travels contribute to a greener future.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Pillar 1 */}
            <div className="bg-surface-white rounded-3xl p-8 border border-outline-variant/40 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[32px]">forest</span>
              </div>
              <h3 className="font-display font-bold text-xl text-on-surface mb-3">One Booking, One Tree</h3>
              <p className="text-on-surface-variant leading-relaxed">
                We've integrated reforestation directly into our business model. Every time you book a stay through our platform, we fund the planting of a tree in deforested regions around the globe.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-surface-white rounded-3xl p-8 border border-outline-variant/40 shadow-sm hover:shadow-lg transition-all duration-300 md:-translate-y-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[32px]">verified</span>
              </div>
              <h3 className="font-display font-bold text-xl text-on-surface mb-3">Eco-Certified Stays</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Properties on our platform aren't just beautiful; they are vetted. We prioritize hosts who utilize renewable energy, practice water conservation, and eliminate single-use plastics.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-surface-white rounded-3xl p-8 border border-outline-variant/40 shadow-sm hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 rounded-2xl bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[32px]">volunteer_activism</span>
              </div>
              <h3 className="font-display font-bold text-xl text-on-surface mb-3">Community First</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Sustainability is also about people. A portion of our revenue goes towards supporting local artisan communities and funding eco-education programs in the areas you visit.
              </p>
            </div>
          </div>
        </section>

        {/* CALL TO ACTION */}
        <section className="bg-primary-container py-20 px-5 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-on-primary-container mb-6">
              Ready to leave a positive footprint?
            </h2>
            <p className="text-on-primary-container/80 text-lg mb-10">
              Discover beautiful homes that align with your values. Your next adventure awaits.
            </p>
            <Link 
              to="/explore" 
              className="inline-flex items-center gap-2 bg-primary text-on-primary font-bold text-[16px] px-8 py-4 rounded-full hover:opacity-90 transition-opacity shadow-lg"
            >
              <span className="material-symbols-outlined">travel_explore</span>
              Explore Eco-Stays
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
