 import Hero from "../components/sections/Hero";
import Showroom from "../components/sections/Showroom";
import WorkshopGallery from "../components/sections/WorkshopGallery";
import About from "../components/sections/About";
import Stats from "../components/sections/Stats";
import DashboardPreview from "../components/sections/DashboardPreview";
import HowItWorks from "../components/sections/HowItWorks";
import Analytics from "../components/sections/Analytics";
import FutureFeatures from "../components/sections/FutureFeatures";
import Testimonials from "../components/sections/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Showroom />
      <WorkshopGallery />
      <About />
      <Stats />
      <DashboardPreview />
      <HowItWorks />
      <Analytics />
      <FutureFeatures />
      <Testimonials />
    </>
  );
}
