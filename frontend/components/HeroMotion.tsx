"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface HeroMotionProps {
  children: ReactNode;
  className?: string;
}

export function HeroMotion({ children, className = "" }: HeroMotionProps) {
  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] ${className}`}>
      {/* Deep gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d0f14] via-[#1e1b4b] to-[#0f172a]" />

      {/* Animated color orbs — mesh gradient */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Violet orb — top left */}
        <motion.div
          className="absolute -top-32 -left-32 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124, 58, 237, 0.45) 0%, transparent 65%)" }}
          animate={{ x: [0, 120, 0], y: [0, -60, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Amber orb — bottom right */}
        <motion.div
          className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(245, 158, 11, 0.28) 0%, transparent 65%)" }}
          animate={{ x: [0, -90, 0], y: [0, 80, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* Teal orb — center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(13, 148, 136, 0.22) 0%, transparent 65%)" }}
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        />
        {/* Indigo orb — top right */}
        <motion.div
          className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(79, 70, 229, 0.35) 0%, transparent 65%)" }}
          animate={{ x: [0, -50, 0], y: [0, 60, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        {/* Rose orb — bottom left */}
        <motion.div
          className="absolute bottom-0 left-1/4 w-[350px] h-[350px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(244, 63, 94, 0.12) 0%, transparent 60%)" }}
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut", delay: 6 }}
        />
      </div>

      {/* Dot grid overlay */}
      <div className="absolute inset-0 dot-grid-dark" />

      {/* Noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        {children}
      </motion.div>

      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#0d0f14]/70 to-transparent pointer-events-none" />
    </div>
  );
}
