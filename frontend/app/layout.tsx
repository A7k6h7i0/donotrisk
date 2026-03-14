import "./globals.css";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AuthGate } from "@/components/AuthGate";
import { OneSignalProvider } from "@/components/OneSignalProvider";

export const metadata: Metadata = {
  title: "DoNotRisk - Warranty Intelligence Platform",
  description: "Understand warranty risk before it costs you. Scan warranty cards, decode terms, evaluate exclusions, and track expiry timelines.",
  keywords: ["warranty", "risk", "insurance", "product warranty", "warranty tracking", "AI warranty analysis"],
  openGraph: {
    title: "DoNotRisk - Warranty Intelligence Platform",
    description: "Understand warranty risk before it costs you.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-atmosphere min-h-screen flex flex-col antialiased">
        <OneSignalProvider>
          <Navbar />
          <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <AuthGate>{children}</AuthGate>
          </main>
          <Footer />
        </OneSignalProvider>
      </body>
    </html>
  );
}
