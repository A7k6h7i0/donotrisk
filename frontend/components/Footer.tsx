"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-ink text-paper mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <h3 className="font-display text-lg mb-3">DoNotRisk</h3>
            <p className="text-paper/70 text-xs leading-relaxed">
              Your intelligent warranty management platform. We help you understand, track, and maximize your product warranties using advanced AI technology.
            </p>
          </div>

          {/* Quick Links - Compact */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Quick Links</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="text-paper/70 hover:text-paper transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/scanner" className="text-paper/70 hover:text-paper transition">
                  Warranty Scanner
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-paper/70 hover:text-paper transition">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-paper/70 hover:text-paper transition">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-paper/70 hover:text-paper transition">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-paper/70 hover:text-paper transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-paper/70 hover:text-paper transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/privacy" className="text-paper/70 hover:text-paper transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-paper/70 hover:text-paper transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-paper/70 hover:text-paper transition">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-paper/10 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-paper/50 text-xs">
            © {currentYear} DoNotRisk. All rights reserved.
          </p>
          <p className="text-paper/50 text-xs text-center md:text-right">
            AI-powered warranty analysis platform. Verify official documentation.
          </p>
        </div>
      </div>
    </footer>
  );
}
