import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CategoryFilter from '../components/CategoryFilter';
import FeaturedProperties from '../components/FeaturedProperties';
import Sustainability from '../components/Sustainability';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CategoryFilter />
        <FeaturedProperties />
        <Sustainability />
      </main>
      <Footer />
    </>
  );
}
