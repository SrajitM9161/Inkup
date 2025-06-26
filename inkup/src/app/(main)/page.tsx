import HomePage from "../(landing)/landing/page";
import PricingSection from "../components/PricingSection";
export default function () {
  return <main>
  <HomePage/>
  <div className=" bg-dot-pattern flex gap-6 flex-wrap justify-center">
        <PricingSection />
      </div>
  </main>;
}
