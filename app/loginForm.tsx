"use client";

import { useState } from "react";
import { login } from "./utils/authFunctions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function LoginForm({ title }: { title?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    if (result.success) {
      setMessage("Login successful!");
    } else {
      setMessage(result.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="font-semibold text-black" variant={"outline"}>
            {title || "Login"}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Please log in to continue</DialogTitle>
            <DialogDescription>
              After you&apos;re logged in, you&apos;ll be able to add pizzas,
              toppings, and more.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                placeholder="john@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {loading ? (
              <Button disabled className="flex w-full">
                <Loader2 className="animate-spin" /> Logging in
              </Button>
            ) : (
              <Button className="flex w-full" type="submit">
                Log in
              </Button>
            )}
            {message && (
              <p
                className={cn(
                  "mt-2 text-sm text-center",
                  message.includes("successful")
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {message}
              </p>
            )}
          </form>
          <div className="flex justify-center gap-2">
            Don&apos;t have an acccount?{" "}
            <DialogTrigger asChild>
              <Link href={"/sign-up"} className="text-blue-600 underline">
                Sign up today!
              </Link>
            </DialogTrigger>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
