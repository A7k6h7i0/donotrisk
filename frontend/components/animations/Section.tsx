"use client";

import { motion, useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  background?: "default" | "white" | "dark" | "gradient" | "mesh";
}

export function Section({
  children,
  className = "",
  id,
  background = "default",
}: SectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const backgrounds = {
    default: "bg-paper",
    white: "bg-white",
    dark: "bg-ink text-white",
    gradient: "bg-gradient-to-br from-ink to-slate text-white",
    mesh: "bg-mesh",
  };

  return (
    <section
      ref={ref}
      id={id}
      className={`relative overflow-hidden ${backgrounds[background]} ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.25, 0.25, 0.25, 0.75] }}
      >
        {children}
      </motion.div>
    </section>
  );
}
