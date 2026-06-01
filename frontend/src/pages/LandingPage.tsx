import Navbar from "../components/layout/Navbar";
import Hero from "../components/landing/Hero";
import CategoryFilter from "../components/landing/CategoryFilter";
import FeaturedProperties from "../components/landing/FeaturedProperties";
import Sustainability from "../components/landing/Sustainability";
import Footer from "../components/layout/Footer";

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
