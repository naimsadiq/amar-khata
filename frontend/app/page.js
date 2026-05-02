import Hero from "@/home/banner/HeroSection";
import Stats from "@/home/banner/StatsSection";
import Cta from "@/home/Cta";
import Faq from "@/home/Faq";
import Features from "@/home/Features";
import Footer from "@/home/Footer";
import HowItWorks from "@/home/HowItWorks";
import Navbar from "@/home/navbar/Navbar";
import Pricing from "@/home/Pricing";
import Testimonials from "@/home/Testimonials";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
