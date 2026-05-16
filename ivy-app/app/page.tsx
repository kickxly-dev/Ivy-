import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import ProductShowcase from "@/components/landing/ProductShowcase";
import Ecosystem from "@/components/landing/Ecosystem";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ivy-black">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <ProductShowcase />
        <Ecosystem />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
