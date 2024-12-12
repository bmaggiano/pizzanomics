import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Pizza, HopOff } from "lucide-react";
import IsAuthenticated from "./isAuthenticated";

const navItems = [
  { name: "Pizzas", href: "#pizzas", icon: <Pizza /> },
  { name: "Toppings", href: "#toppings", icon: <HopOff /> },
];

export default function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[80%] max-w-[400px] p-0">
        <SheetHeader className="border-b p-6">
          <SheetTitle className="text-left text-2xl font-bold">
            Pizzanomics
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 p-6">
          <IsAuthenticated />
          <Separator />
          <NavigationMenu>
            <ul className="gap-4 ">
              {navItems.map((item) => (
                <SheetTrigger
                  key={item.name}
                  asChild
                  className="flex items-center gap-2 mb-2"
                >
                  <li>
                    {item.icon}
                    <a
                      href={item.href}
                      className="text-lg text-gray-800 font-semibold text-base hover:text-gray-700"
                    >
                      {item.name}
                    </a>
                  </li>
                </SheetTrigger>
              ))}
            </ul>
          </NavigationMenu>
          <Separator />
        </div>
      </SheetContent>
    </Sheet>
  );
}
