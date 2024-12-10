import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Pizza, HopOff } from "lucide-react";
import MobileNavigation from "./mobileNav";

const navItems = [
  { name: "Pizzas", href: "#pizzas", icon: <Pizza /> },
  { name: "Toppings", href: "#toppings", icon: <HopOff /> },
];

export default function Navbar() {
  return (
    <div className="bg-white">
      <nav className="flex justify-between items-center p-4">
        <div className="flex items-center sm:justify-between w-full">
          <img src="/pizza.png" alt="Pizzanomics Logo" className="h-8 mr-4" />
          <h1 className="text-2xl tracking-tight font-bold">Pizzanomics</h1>
          {/* for desktop */}
          <div className="hidden sm:flex sm:justify-between sm:w-full">
            <ul className="ml-4 flex items-center gap-4">
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
