"use client";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section
      className="relative bg-cover bg-center py-12 sm:py-32"
      style={{ backgroundImage: "url('/heroPizza.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-75"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-lg text-white">
          <h2 className="text-5xl font-bold mb-4">Discover the Art of Pizza</h2>
          <p className="text-xl mb-8">
            Explore our exquisite selection of handcrafted pizzas and premium
            toppings.
          </p>
          <Button variant={"outline"} className="text-black font-semibold">
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
}
