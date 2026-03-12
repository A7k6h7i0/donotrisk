"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Scan Warranty Cards",
    description: "Simply upload or photograph your warranty card and let our AI do the rest.",
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    gradient: "from-blue-500 via-cyan-500 to-teal-400",
    glow: "rgba(6, 182, 212, 0.4)",
  },
  {
    title: "Detect Warranty Risks",
    description: "Our AI analyzes thousands of warranty terms to identify hidden exclusions and risks.",
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    gradient: "from-amber-500 via-orange-500 to-red-400",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  {
    title: "Track Expiry Dates",
    description: "Never miss a warranty expiration again with smart tracking and reminders.",
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
    gradient: "from-emerald-500 via-green-500 to-teal-400",
    glow: "rgba(16, 185, 129, 0.4)",
  },
  {
    title: "Smart Warranty Insights",
    description: "Get comprehensive insights about your product warranties and make informed decisions.",
    icon: (
      <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
    gradient: "from-violet-500 via-purple-500 to-pink-400",
    glow: "rgba(124, 58, 237, 0.4)",
  },
];

export function CapabilitySlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-[2rem] shadow-2xl"
      style={{ background: "linear-gradient(135deg, #0d0f14 0%, #1e1b4b 50%, #0f172a 100%)" }}
    >
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/2 -left-1/4 w-1/2 h-full rounded-full opacity-25 blur-3xl"
          style={{ background: `radial-gradient(circle, ${slides[current].glow} 0%, transparent 70%)` }}
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-1/2 -right-1/4 w-1/2 h-full rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, rgba(79,70,229,0.4) 0%, transparent 70%)" }}
          animate={{ x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        {/* Dot grid */}
        <div className="absolute inset-0 dot-grid-dark opacity-50" />
      </div>

      <div className="relative p-8 md:p-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -24, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col lg:flex-row items-center gap-10"
          >
            {/* Icon with gradient ring */}
            <motion.div
              initial={{ scale: 0.8, rotate: -8 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 200 }}
              className="flex-shrink-0 relative"
            >
              {/* Gradient ring */}
              <div
                className={`w-36 h-36 rounded-3xl bg-gradient-to-br ${slides[current].gradient} p-[2px] shadow-2xl`}
                style={{ boxShadow: `0 0 40px ${slides[current].glow}` }}
              >
                <div className="w-full h-full bg-[#0d0f14] rounded-[calc(1.5rem-2px)] flex items-center justify-center text-white">
                  {slides[current].icon}
                </div>
              </div>
              {/* Orbiting dot */}
              <motion.div
                className={`absolute w-3 h-3 rounded-full bg-gradient-to-r ${slides[current].gradient} shadow-lg`}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ top: "-4px", left: "50%", transformOrigin: "0 72px" }}
              />
            </motion.div>

            {/* Content */}
            <div className="flex-1 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest text-white/50 border border-white/10"
              >
                <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${slides[current].gradient}`} />
                Capability {current + 1} of {slides.length}
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white"
              >
                {slides[current].title}
              </motion.h3>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-4 text-lg text-white/60 max-w-2xl leading-relaxed"
              >
                {slides[current].description}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="mt-12 flex justify-center gap-2.5">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrent(index)}
              className={`relative h-2 rounded-full transition-all duration-500 overflow-hidden ${
                index === current ? "w-14" : "w-2 bg-white/20 hover:bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              {index === current && (
                <motion.div
                  layoutId="slider-indicator"
                  className={`absolute inset-0 rounded-full bg-gradient-to-r ${slides[current].gradient}`}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
