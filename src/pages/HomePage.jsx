import { useReveal } from "../hooks/useReveal";
import Hero from "../components/home/Hero";
import Marquee from "../components/home/Marquee";
import About from "../components/home/About";
import ProductsSection from "../components/home/ProductsSection";
import Values from "../components/home/Values";
import Testimonials from "../components/home/Testimonials";
import GalleryPreview from "../components/home/GalleryPreview";
import Contact from "../components/home/Contact";
import Footer from "../components/Footer";

export default function HomePage({ onViewDetail, onViewAll, scrollTo }) {
  useReveal();
  return (
    <div className="a-page">
      <Hero scrollTo={scrollTo} />
      <Marquee />
      <About />
      <ProductsSection onViewDetail={onViewDetail} onViewAll={onViewAll} />
      <Values />
      <Testimonials />
      <GalleryPreview onViewAll={onViewAll} />
      <Contact />
      <Footer />
    </div>
  );
}
