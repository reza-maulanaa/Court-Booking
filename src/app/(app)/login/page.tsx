import type { Metadata } from "next";
import { AuthForm } from "@/components/auth-form";

export const metadata: Metadata = { title: "Masuk — Booking Futsal" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-gradient-to-b from-primary/5 to-transparent p-4 py-16">
      <AuthForm mode="login" />
    </main>
  );
}
