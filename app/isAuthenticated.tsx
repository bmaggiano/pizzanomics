"use server";
import { Button } from "@/components/ui/button";
import { logout } from "./utils/authFunctions";
import { verifyToken } from "./utils/auth";
import { cookies } from "next/headers";
import LoginForm from "./loginForm";

export default async function IsAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return <LoginForm />;
  }

  const verifiedToken = verifyToken(token);

  if (!verifiedToken) {
    return <LoginForm />;
  }

  if (verifiedToken) {
    return (
      <Button className="font-semibold" variant={"outline"} onClick={logout}>
        Logout
      </Button>
    );
  }
}
