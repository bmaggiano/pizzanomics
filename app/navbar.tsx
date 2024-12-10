import { Button } from "@/components/ui/button";
import { Pizza, HopOff } from "lucide-react";
import MobileNavigation from "./mobileNav";
import Image from "next/image";

const navItems = [
  { name: "Pizzas", href: "#pizzas", icon: <Pizza /> },
  { name: "Toppings", href: "#toppings", icon: <HopOff /> },
];

export default function Navbar() {
  return (
    <div className="bg-white">
      <nav className="flex justify-between items-center p-4">
        <div className="flex items-center sm:justify-between w-full">
          <Image
            src="/pizza.png"
            alt="Pizzanomics Logo"
            height={25}
            width={25}
            className="mr-2"
          />
          <h1 className="text-2xl tracking-tight font-bold">Pizzanomics</h1>
          {/* for desktop */}
          <div className="hidden sm:flex sm:justify-between sm:w-full">
            <ul className="ml-6 flex items-center gap-4">
              {navItems.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-600 font-medium hover:text-gray-700"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
            <Button className="font-semibold" variant={"outline"}>
              Login
            </Button>
          </div>
        </div>
        {/* for mobile */}
        <div className="sm:hidden">
          <MobileNavigation />
        </div>
      </nav>
    </div>
  );
}
