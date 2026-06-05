import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/landing/Hero";
import SearchWidget from "../../components/landing/SearchWidget";
import CategoryFilter from "../../components/landing/CategoryFilter";
import FeaturedProperties from "../../components/landing/FeaturedProperties";
import Sustainability from "../../components/landing/Sustainability";
import Footer from "../../components/layout/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* SearchWidget sticky — overlaps Hero bottom edge, sticks below Navbar on scroll */}
        <div className="sticky top-[72px] z-40 flex justify-center w-full px-5 pointer-events-none" style={{ marginTop: '-200px', paddingBottom: '150px' }}>
          <div className="pointer-events-auto w-full max-w-[1000px]">
            <SearchWidget scrollThreshold={300} />
          </div>
        </div>

        <CategoryFilter />
        <FeaturedProperties />
        <Sustainability />
      </main>
      <Footer />
    </>
  );
}
