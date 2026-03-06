"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

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
            { href: "/categories", label: "Categories" },
            { href: "/scanner", label: "Scanner" },
            { href: "/agents", label: "Browse Agents" },
            { href: "/assistant", label: "AI Assistant" },
            { href: dashboardHref, label: dashboardLabel }
          ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex flex-col">
          <Link href={token ? "/" : "/login"} className="font-display text-xl font-bold tracking-tight text-ink">
            DoNotRisk
          </Link>
          <p className="text-xs text-ink/60">{quotes[quoteIndex]}</p>
        </div>

        {token ? (
          <div className="flex items-center gap-3">
            <nav className="hidden items-center gap-2 md:flex">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-3 py-1.5 text-sm ${
                    pathname === link.href ? "bg-ink text-paper" : "text-ink/75 hover:bg-ink/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="relative">
              <button
                className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-sm font-bold text-paper"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Open profile menu"
              >
                {avatarLabel}
              </button>

              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-ink/10 bg-white p-2 shadow-lg">
                  <div className="mb-1 border-b border-ink/10 px-3 py-2 text-xs text-ink/70">
                    {userName || userEmail || "Account"}
                  </div>
                  <div className="md:hidden">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-ink/5">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <button className="mt-1 block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-ink/5" onClick={logout}>
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="text-sm text-ink/60">Welcome</div>
        )}
      </div>
    </header>
  );
}
