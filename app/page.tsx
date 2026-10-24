import { DoseCardApp } from "@/components/DoseCardApp";
import { HowItWorks, Hero, Proof, Safety, SiteFooter, SiteHeader, Why } from "@/components/Site";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <Why />
        <HowItWorks />
        <DoseCardApp />
        <Proof />
        <Safety />
      </main>
      <SiteFooter />
    </>
  );
}
