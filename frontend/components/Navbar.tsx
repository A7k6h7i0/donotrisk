"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split(".")[1];
    if (!base64) return null;
    const normalized = base64.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(normalized);
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function Navbar() {
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const quotes = useMemo(
    () => [
      "Your Money, Your Choice",
      "Scan Before You Spend",
      "Safer Purchases Start Here",
      "Know Risk Before Checkout",
      "Every Label Tells a Story",
      "Shop Smart, Avoid Surprises",
      "Transparency in Every Purchase",
      "Protect Health, Protect Wallet",
      "Compare Better, Buy Better",
      "DoNotRisk Every Day"
    ],
    []
  );
  const [quoteIndex, setQuoteIndex] = useState(0);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    let savedName = localStorage.getItem("user_name") || "";
    let savedEmail = localStorage.getItem("user_email") || "";

    if (savedToken && (!savedName || !savedEmail)) {
      const payload = decodeJwtPayload(savedToken);
      const email = typeof payload?.email === "string" ? payload.email : "";
      if (!savedEmail && email) {
        savedEmail = email;
        localStorage.setItem("user_email", email);
      }
      const name = typeof payload?.name === "string" ? payload.name : "";
      if (!savedName && name) {
        savedName = name;
        localStorage.setItem("user_name", name);
      }
    }

    setToken(savedToken);
    setRole(savedRole);
    setUserName(savedName);
    setUserEmail(savedEmail);
    setMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const ms = Math.random() < 0.5 ? 3000 : 5000;
    const timer = window.setTimeout(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, ms);
    return () => window.clearTimeout(timer);
  }, [quoteIndex, quotes]);

  const avatarLabel = useMemo(() => {
    const fromName = userName.trim().charAt(0);
    if (fromName) return fromName.toUpperCase();
    const fromEmail = userEmail.trim().charAt(0);
    if (fromEmail) return fromEmail.toUpperCase();
    return role === "admin" ? "A" : "U";
  }, [role, userName, userEmail]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
    setToken(null);
    setRole(null);
    setUserName("");
    setUserEmail("");
    setMenuOpen(false);
    window.location.href = "/login";
  }

  const dashboardHref = role === "admin" ? "/admin" : role === "agent" ? "/agent/dashboard" : "/dashboard";
  const dashboardLabel = role === "admin" ? "Admin Dashboard" : role === "agent" ? "Agent Dashboard" : "My Dashboard";

  const navLinks =
    role === "agent"
        ? [
            { href: "/agent/dashboard", label: "Dashboard" },
            { href: "/agent/register-product", label: "Register Product" },
            { href: "/agent/add-warranty", label: "Add Warranty" },
            { href: "/agent/customers", label: "Customers" }
          ]
      : role === "admin"
        ? [
            { href: "/admin", label: "Admin Home" },
            { href: "/admin/agents", label: "Manage Agents" },
            { href: "/admin/reviews", label: "Reviews" },
            { href: "/admin/products", label: "Products" },
            { href: "/assistant", label: "AI Assistant" }
          ]
        : [
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/services", label: "Services" },
            { href: "/features", label: "Features" },
            { href: "/categories", label: "Categories" },
            { href: "/scanner", label: "Scanner" },
            { href: "/agents", label: "Browse Agents" },
            { href: "/assistant", label: "AI Assistant" },
            { href: "/contact", label: "Contact" },
            { href: dashboardHref, label: dashboardLabel }
          ];

  const mobileNavLinks = token
    ? navLinks
    : [
        { href: "/", label: "Home" },
        { href: "/categories", label: "Products" },
        { href: "/services", label: "Services" },
        { href: "/features", label: "Features" },
        { href: "/scanner", label: "Scanner" },
        { href: "/assistant", label: "AI Assistant" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
      ];

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "py-2"
            : "py-4"
        }`}
      >
        {/* Navbar background — separate div for clean transition */}
        <div
          className={`absolute inset-0 transition-all duration-500 ${
            scrolled
              ? "bg-white/80 backdrop-blur-2xl shadow-navbar border-b border-white/60"
              : "bg-white/30 backdrop-blur-md"
          }`}
        />

        {/* Gradient top accent line — appears on scroll */}
        <div
          className={`absolute top-0 left-0 right-0 h-px transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "linear-gradient(90deg, #7c3aed, #4f46e5, #0d9488)",
          }}
        />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href={token ? "/" : "/login"} className="group">
              <div className="flex items-center gap-2.5">
                {/* Shield icon with gradient ring */}
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-600 to-indigo-600 text-white shadow-glow-sm transition-all duration-300 group-hover:shadow-glow-violet group-hover:scale-105">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  {/* Ping ring on hover */}
                  <div className="absolute inset-0 rounded-xl bg-primary-500 opacity-0 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500" />
                </div>

                <div className="flex flex-col">
                  <span className="font-display text-xl font-bold tracking-tight text-ink">
                    DoNotRisk
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={quoteIndex}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.3 }}
                      className="text-[10px] text-ink/40 font-medium tracking-wide"
                    >
                      {quotes[quoteIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {token ? (
              <div className="hidden md:flex items-center gap-2">
                <nav className="flex items-center gap-0.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                        pathname === link.href
                          ? "text-primary-700"
                          : "text-ink/55 hover:text-ink"
                      }`}
                    >
                      {pathname === link.href && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(79,70,229,0.08) 100%)",
                            border: "1px solid rgba(124,58,237,0.2)",
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* Profile Menu */}
                <div className="relative ml-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-glow-sm hover:shadow-glow-violet transition-all duration-300"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Open profile menu"
                  >
                    {avatarLabel}
                  </motion.button>

                  <AnimatePresence>
                    {menuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 mt-3 w-64 rounded-2xl bg-white/95 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100/80 overflow-hidden"
                      >
                        {/* Profile header */}
                        <div className="px-5 py-4 border-b border-gray-100"
                          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(79,70,229,0.04))" }}
                        >
                          <p className="font-semibold text-ink">{userName || "Account"}</p>
                          <p className="text-xs text-ink/50 truncate mt-0.5">{userEmail}</p>
                        </div>
                        <div className="p-2">
                          {navLinks.map((link) => (
                            <Link
                              key={link.href}
                              href={link.href}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink/70 hover:text-ink hover:bg-primary-50/60 rounded-xl transition-colors"
                              onClick={() => setMenuOpen(false)}
                            >
                              {link.label}
                            </Link>
                          ))}
                          <button
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors mt-1"
                            onClick={logout}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <nav className="flex items-center gap-0.5">
                  {[
                    { href: "/", label: "Home" },
                    { href: "/categories", label: "Products" },
                    { href: "/services", label: "Services" },
                    { href: "/features", label: "Features" },
                    { href: "/scanner", label: "Scanner" },
                    { href: "/assistant", label: "AI" },
                    { href: "/about", label: "About" },
                    { href: "/contact", label: "Contact" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`relative px-3.5 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                        pathname === link.href
                          ? "text-primary-700"
                          : "text-ink/55 hover:text-ink"
                      }`}
                    >
                      {pathname === link.href && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(79,70,229,0.08) 100%)",
                            border: "1px solid rgba(124,58,237,0.2)",
                          }}
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <span className="relative z-10">{link.label}</span>
                    </Link>
                  ))}
                </nav>

                {/* Sign In — gradient shimmer button */}
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <Link
                    href="/login"
                    className="btn-shimmer inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-glow-sm hover:shadow-glow-violet transition-all duration-300"
                    style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                  >
                    Sign In
                  </Link>
                </motion.div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.88 }}
              className="md:hidden relative p-2.5 rounded-xl hover:bg-ink/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <motion.span
                  animate={mobileMenuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="block h-0.5 rounded-full origin-left"
                  style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5)" }}
                />
                <motion.span
                  animate={mobileMenuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                  className="block h-0.5 bg-ink/70 rounded-full"
                />
                <motion.span
                  animate={mobileMenuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="block h-0.5 rounded-full origin-left"
                  style={{ background: "linear-gradient(90deg, #4f46e5, #0d9488)" }}
                />
              </div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden relative border-t border-white/40 bg-white/95 backdrop-blur-2xl overflow-hidden"
            >
              <div className="px-4 py-5 space-y-1.5">
                {token ? (
                  <>
                    <div className="px-4 py-3 mb-3 rounded-xl"
                      style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(79,70,229,0.05))", border: "1px solid rgba(124,58,237,0.15)" }}
                    >
                      <p className="font-semibold text-ink">{userName || userEmail || "Account"}</p>
                    </div>
                    {navLinks.map((link, i) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                      >
                        <Link
                          href={link.href}
                          className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                            pathname === link.href
                              ? "text-white"
                              : "text-ink/70 hover:text-ink hover:bg-primary-50/60"
                          }`}
                          style={pathname === link.href ? { background: "linear-gradient(135deg, #7c3aed, #4f46e5)" } : {}}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                    <button
                      className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                      onClick={logout}
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    {mobileNavLinks.map((link, i) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.25 }}
                      >
                        <Link
                          href={link.href}
                          className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                            pathname === link.href
                              ? "text-white"
                              : "text-ink/70 hover:text-ink hover:bg-primary-50/60"
                          }`}
                          style={pathname === link.href ? { background: "linear-gradient(135deg, #7c3aed, #4f46e5)" } : {}}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: mobileNavLinks.length * 0.04 }}
                    >
                      <Link
                        href="/login"
                        className="block w-full text-center px-4 py-3 mt-3 text-white font-semibold rounded-xl shadow-glow-sm"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-20" />
    </>
  );
}
