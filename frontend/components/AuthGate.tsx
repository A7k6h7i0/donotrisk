"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const authPages = new Set(["/login", "/register", "/agent/login", "/agent/register"]);

// Public pages that don't require login
const publicPages = new Set([
  "/",
  "/categories",
  "/services",
  "/features",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer"
]);

// Check if path is a public category or product page
function isPublicContentPath(pathname: string): boolean {
  return pathname.startsWith("/categories/") || pathname.startsWith("/products/");
}

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Allow public pages without authentication
    if (publicPages.has(pathname) || isPublicContentPath(pathname)) {
      setReady(true);
      return;
    }

    if (!token && !authPages.has(pathname)) {
      router.replace("/login");
      return;
    }

    if (token && authPages.has(pathname)) {
      router.replace(role === "admin" ? "/admin" : role === "agent" ? "/agent/dashboard" : "/dashboard");
      return;
    }

    if (token && role === "agent" && !pathname.startsWith("/agent") && !pathname.startsWith("/agents")) {
      router.replace("/agent/dashboard");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;
  return <>{children}</>;
}
