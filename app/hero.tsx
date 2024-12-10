"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Hero() {
  return (
    // <section className="bg-gradient-to-r from-red-500 to-red-700 py-20">
    //   <div className="container mx-auto px-4 flex items-center justify-between">
    //     <div className="max-w-lg">
    //       <h2 className="text-5xl text-white font-bold mb-4">
    //         Discover the Art of Pizza
    //       </h2>
    //       <p className="text-xl text-white mb-8">
    //         Explore our exquisite selection of handcrafted pizzas and premium
    //         toppings.
    //       </p>
    //       <Button variant={"outline"}>Order Now</Button>
    //     </div>
    //     <div className="hidden md:block">
    //       <Image
    //         src="/heroPizza.jpg"
    //         alt="Delicious Pizza"
    //         width={500}
    //         height={200}
    //         className="shadow-2xl"
    //       />
    //     </div>
    //   </div>
    // </section>
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
          <Button variant={"outline"} className="text-black">
            Order Now
          </Button>
        </div>
      </div>
    </section>
  );
}
