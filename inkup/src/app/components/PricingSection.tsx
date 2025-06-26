'use client';

import PricingCard from './PricingCard';
import { plans } from '../Constants/constant';
export default function PricingSection() {
  return (
    <section className="w-full bg-dot-pattern py-20 px-4">
      <div className="text-center mb-14">
        <h2 className="text-[35px] font-semibold font-['Roboto_Serif'] text-white">
          Choose the <span className="text-pink-500">perfect plan</span> for you
        </h2>
        <p className="text-white/80 text-[21.875px] font-light mt-2">
          Choose the perfect plan for youplan for you
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
        {plans.map((plan, index) => (
          <PricingCard key={index} {...plan} />
        ))}
      </div>
    </section>
  );
}
