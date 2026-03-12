"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { href: "/scanner", label: "Warranty Scanner" },
      { href: "/categories", label: "Products" },
      { href: "/features", label: "Features" },
      { href: "/services", label: "Services" },
    ],
    company: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/agents", label: "Browse Agents" },
      { href: "/assistant", label: "AI Assistant" },
    ],
    legal: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  };

  const socials = [
    { label: "Twitter", d: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" },
    { label: "Facebook", d: "M22.46 6c-.85.38-1.78.64-2.75.76 1-.6 1.76-1.55 2.12-2.68-.93.55-1.96.95-3.06 1.17-.88-.94-2.13-1.53-3.51-1.53-3.18 0-5.76 2.81-5.76 6.28 0 .49.05.97.15 1.43-4.78-.24-9.03-2.59-11.87-6.15-.5 1.1-.79 2.39-.79 3.76 0 2.18 1.03 4.11 2.59 5.25-.96-.03-1.86-.13-2.65-.31v.03c0 3.04 2.02 5.58 4.71 6.16-.49.13-1.01.2-1.54.2-.38 0-.75-.04-1.11-.11.76 2.45 2.96 4.23 5.58 4.28-2.13 1.71-4.81 2.73-7.72 2.73-.5 0-1-.03-1.49-.09 2.76 1.82 6.04 2.88 9.57 2.88 11.48 0 17.75-9.81 17.75-18.31 0-.28 0-.55-.02-.82.82-.6 1.53-1.35 2.08-2.21z" },
    { label: "LinkedIn", d: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  ];

  return (
    <footer className="relative bg-[#0d0f14] text-white overflow-hidden mt-24">
      {/* Gradient top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5, #0d9488, #4f46e5, #7c3aed)" }}
      />

      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/4 w-1/2 h-full rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #7c3aed 0%, transparent 70%)" }} />
        <div className="absolute -bottom-1/3 -right-1/4 w-1/2 h-full rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #0d9488 0%, transparent 70%)" }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl text-white transition-all duration-300 group-hover:shadow-glow-violet group-hover:scale-105"
                style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
              >
                <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span className="font-display text-2xl font-bold">DoNotRisk</span>
            </Link>

            <p className="mt-6 text-white/50 text-sm leading-relaxed max-w-sm">
              Your intelligent warranty management platform. We help you understand, track, and maximize your product warranties using advanced AI technology.
            </p>

            {/* Social links */}
            <div className="mt-8 flex gap-3">
              {socials.map((social, i) => (
                <motion.a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="group/s flex h-10 w-10 items-center justify-center rounded-full bg-white/8 border border-white/10 text-white/50 transition-all duration-300 hover:border-primary-500/40"
                  style={{ background: "rgba(255,255,255,0.06)" }}
                >
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover/s:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(79,70,229,0.2))" }}
                  />
                  <svg className="relative h-4 w-4 transition-colors duration-300 group-hover/s:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.d} />
                  </svg>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {([
            { title: "Product",  links: footerLinks.product  },
            { title: "Company",  links: footerLinks.company  },
            { title: "Legal",    links: footerLinks.legal    },
          ] as const).map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-6">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group/l inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors duration-300"
                    >
                      <span
                        className="h-px transition-all duration-300 w-0 group-hover/l:w-5"
                        style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5)" }}
                      />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/30 text-sm">
              © {currentYear} DoNotRisk. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-white/30 text-sm">
                AI-powered warranty analysis platform
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
