import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import FeaturedProperties from '../components/FeaturedProperties';
import Sustainability from '../components/Sustainability';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CategoryFilter />
        <FeaturedProperties />
        <Sustainability />
      </main>
      <Footer />
    </div>
  );
}
