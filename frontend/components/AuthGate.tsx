"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const authPages = new Set(["/login", "/register"]);

export function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(false);
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token && !authPages.has(pathname)) {
      router.replace("/login");
      return;
    }

    if (token && authPages.has(pathname)) {
      router.replace(role === "admin" ? "/admin" : "/dashboard");
      return;
    }

    setReady(true);
  }, [pathname, router]);

  if (!ready) return null;
  return <>{children}</>;
}
