import React from "react";
import Hero from "./Hero";
import LogoCarousel from "./contents";
import SpecialAccounting from "./SpecialAccounting";
import WebDevSpecial from "./SpecialWebDev";
import ScrollTypography from "./ScrollAnime";
import DesignTestimonial from "./DesigningUi";
import PricingSection from "./Offers";
import GtecFooter from "../Main/Footer";
import GtecWelcomeSection from "./FinalHome";

export default function HomeSection() {
  return (
    <>
      <main className="pt-20">
        <Hero />
        <LogoCarousel />
        <SpecialAccounting />
        <WebDevSpecial />
        <ScrollTypography />
        <DesignTestimonial />
        <PricingSection />
        <GtecWelcomeSection />
      </main>
    </>
  );
}
