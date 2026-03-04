import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { AuthGate } from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "DoNotRisk",
  description: "Warranty intelligence and risk analytics platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-atmosphere min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8">
          <AuthGate>{children}</AuthGate>
        </main>
      </body>
    </html>
  );
}
