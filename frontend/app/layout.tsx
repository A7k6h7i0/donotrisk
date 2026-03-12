import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthGate } from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "DoNotRisk",
  description: "Warranty intelligence and risk analytics platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-atmosphere min-h-screen flex flex-col">
        <Navbar />
        <main className="mx-auto max-w-6xl px-4 py-8 flex-1">
          <AuthGate>{children}</AuthGate>
        </main>
        <Footer />
      </body>
    </html>
  );
}
