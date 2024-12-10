import SignUpForm from "../signupForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-[55rem] overflow-hidden">
        <div className="flex">
          <Image
            className="hidden lg:block"
            src="/signup.avif"
            alt="Sign up"
            width={400}
            height={400}
          />
          <div className="flex flex-col w-full justify-center px-4">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Create an account
              </CardTitle>
              <CardDescription className="text-center">
                Enter your details below to create your account and get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignUpForm />
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
}
