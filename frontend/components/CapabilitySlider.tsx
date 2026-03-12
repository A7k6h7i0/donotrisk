"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "Scan Warranty Cards",
    description: "Simply upload or photograph your warranty card and let our AI do the rest.",
    icon: "📷",
  },
  {
    title: "Detect Warranty Risks",
    description: "Our AI analyzes thousands of warranty terms to identify hidden exclusions and risks.",
    icon: "🔍",
  },
  {
    title: "Track Expiry Dates",
    description: "Never miss a warranty expiration again with smart tracking and reminders.",
    icon: "📅",
  },
  {
    title: "Smart Warranty Insights",
    description: "Get comprehensive insights about your product warranties and make informed decisions.",
    icon: "💡",
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
    <div className="relative overflow-hidden rounded-3xl bg-ink p-8 md:p-12">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center md:flex-row md:items-start md:justify-between md:text-left"
        >
          <div className="text-6xl md:text-7xl">{slides[current].icon}</div>
          <div className="mt-6 md:mt-0 md:ml-8">
            <h3 className="font-display text-2xl text-paper md:text-3xl">{slides[current].title}</h3>
            <p className="mt-3 max-w-md text-paper/80">{slides[current].description}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 flex justify-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${
              index === current ? "w-8 bg-paper" : "w-2 bg-paper/30"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
