"use client";
import { User } from "./types/types";
import LoginForm from "./loginForm";

export default function Hero({ user }: { user?: User }) {
  return (
    <section
      className="relative bg-cover bg-center py-12 sm:py-32"
      style={{ backgroundImage: "url('/pizzalogo2.avif')" }}
    >
      <div className="absolute inset-0 bg-black opacity-70 sm:opacity-45"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-lg text-white">
          <h2 className="text-5xl font-bold mb-4">Discover the Art of Pizza</h2>
          <p className="text-xl mb-8">
            Explore our exquisite selection of handcrafted pizzas and premium
            toppings.
          </p>
          {!user ? (
            <LoginForm title="Get Started" />
          ) : (
            <p className="text-lg">Welcome back!</p>
          )}
        </div>
      </div>
    </section>
  );
}
