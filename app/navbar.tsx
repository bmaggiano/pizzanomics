import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Pizzas", href: "#pizzas" },
  { name: "Toppings", href: "#toppings" },
];

export default function Navbar() {
  return (
    <div className="bg-white">
      <nav className="flex justify-between items-center p-4">
        <div className="flex items-center">
          <img src="/pizza.png" alt="Pizzanomics Logo" className="h-8 mr-4" />
          <h1 className="text-2xl tracking-tight font-bold">Pizzanomics</h1>
          <ul className="ml-4 flex items-center gap-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <Button variant={"outline"}>Login</Button>
      </nav>
    </div>
  );
}
