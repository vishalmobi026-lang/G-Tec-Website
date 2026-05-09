import React from "react";
import AboutIntro from "./AboutIntro"
import AboutWhy from "./AboutWhy";
import OurPartners from "./AboutGrade"
import CareersSection from "./AboutCareer";
import StaffSection from "./AboutStaff"
export default function AboutSection() {
  return (
    <>
     <section className="relative z-10 w-full bg-white pt-10 pb-60 font-sans overflow-hidden mb-0">
    <AboutIntro />
    <AboutWhy />
    <OurPartners />
    <StaffSection />
    <CareersSection />
    </section>
    </>
  );
}