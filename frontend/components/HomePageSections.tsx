"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Product } from "@/types";
import { ProductCard } from "@/components/ProductCard";
import { HeroMotion } from "@/components/HeroMotion";
import { HomeActions } from "@/components/HomeActions";
import { CapabilitySlider } from "@/components/CapabilitySlider";
import { FadeIn, StaggerContainer, StaggerItem, ScrollCounter, TextReveal } from "@/components/animations";

interface HomePageSectionsProps {
  products: Product[];
}

const IconShield = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12.75L11.25 15 15 9.75" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconScan = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 7V6a2 2 0 0 1 2-2h2M20 7V6a2 2 0 0 0-2-2h-2" strokeLinecap="round" />
    <path d="M4 17v1a2 2 0 0 0 2 2h2M20 17v1a2 2 0 0 1-2 2h-2" strokeLinecap="round" />
    <rect x="7" y="9" width="10" height="6" rx="2" />
  </svg>
);

const IconBrain = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M9 5a3 3 0 0 0-3 3v1a3 3 0 0 0 0 6v1a3 3 0 0 0 6 0V8a3 3 0 0 0-3-3z" />
    <path d="M15 5a3 3 0 0 1 3 3v1a3 3 0 0 1 0 6v1a3 3 0 0 1-6 0V8a3 3 0 0 1 3-3z" />
  </svg>
);

const IconSearch = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
  </svg>
);

const IconClock = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBell = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" strokeLinecap="round" />
    <path d="M13.73 21a2 2 0 01-3.46 0" strokeLinecap="round" />
  </svg>
);

const IconChart = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M4 19h16" strokeLinecap="round" />
    <rect x="6" y="10" width="3" height="6" rx="1" />
    <rect x="11" y="6" width="3" height="10" rx="1" />
    <rect x="16" y="12" width="3" height="4" rx="1" />
  </svg>
);

const IconSpark = ({ className = "h-5 w-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M12 3l1.7 4.2L18 9l-4.3 1.8L12 15l-1.7-4.2L6 9l4.3-1.8L12 3z" />
  </svg>
);

export function HomePageSections({ products }: HomePageSectionsProps) {
  return (
    <div className="space-y-28 lg:space-y-36">
      <HeroMotion>
        <div className="px-6 py-14 md:px-14 md:py-24 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 border"
                style={{
                  background: "rgba(124, 58, 237, 0.15)",
                  borderColor: "rgba(124, 58, 237, 0.3)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-sm font-semibold text-white/85 tracking-wide">AI-Powered Warranty Intelligence</span>
              </motion.div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-[4.4rem] font-bold text-white leading-[1.08] tracking-tight">
                <TextReveal text="See Warranty Risk" delay={0.2} stagger={0.06} />{" "}
                <span className="relative inline-block">
                  <TextReveal text="Before You Buy" delay={0.5} stagger={0.06} className="relative z-10" />
                  <motion.span
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute -bottom-1 left-0 right-0 h-[6px] rounded-full origin-left"
                    style={{ background: "linear-gradient(90deg, #7c3aed, #4f46e5, #0d9488)" }}
                  />
                </span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="mt-7 text-lg md:text-xl text-white/65 max-w-3xl leading-relaxed"
              >
                Scan warranty cards, decode exclusions, and track expiry timelines with an AI summary you can trust.
              </motion.p>

              <HomeActions />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-16 pt-8 border-t border-white/10"
              >
                <div className="grid grid-cols-3 gap-8">
                  {[
                    { value: 10000, suffix: "+", label: "Products Analyzed" },
                    { value: 98, suffix: "%", label: "Accuracy Rate" },
                    { value: 5000, suffix: "+", label: "Happy Users" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1.0 + i * 0.1 }}
                    >
                      <div className="font-display text-3xl md:text-4xl font-bold text-white">
                        <ScrollCounter end={stat.value} suffix={stat.suffix} />
                      </div>
                      <div className="text-sm text-white/40 mt-1 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            <div className="relative">
              <div className="absolute -inset-10 rounded-[2.5rem] bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-teal-500/10 blur-3xl" />
              <div className="relative mb-6 rounded-[2rem] border border-white/70 bg-white/90 p-4 shadow-[0_18px_60px_-35px_rgba(15,23,42,0.5)]">
                <img
                  src="/preview-dashboard.svg"
                  alt="DoNotRisk analytics dashboard preview"
                  className="h-auto w-full rounded-[1.5rem] border border-ink/5"
                />
              </div>
              <div className="relative rounded-[2.25rem] bg-white/95 p-6 md:p-8 shadow-[0_25px_80px_-40px_rgba(15,23,42,0.6)] border border-white/60">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-ink/50 uppercase tracking-widest">Risk Score</p>
                    <p className="text-3xl font-display font-bold text-ink mt-2">8.2 / 10</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Low Exclusion Risk
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs text-ink/50 mb-2">
                    <span>Coverage Strength</span>
                    <span>82%</span>
                  </div>
                  <div className="h-2 rounded-full bg-ink/10">
                    <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-teal-500" style={{ width: "82%" }} />
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {[
                    { title: "Exclusions Found", value: "2", icon: <IconSearch className="h-4 w-4" /> },
                    { title: "Coverage Window", value: "24 months", icon: <IconClock className="h-4 w-4" /> },
                    { title: "Claim Readiness", value: "High", icon: <IconShield className="h-4 w-4" /> },
                    { title: "AI Summary", value: "Ready", icon: <IconSpark className="h-4 w-4" /> },
                  ].map((item, i) => (
                    <div key={i} className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-2 text-ink/55 text-xs font-semibold">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink/5 text-ink">
                          {item.icon}
                        </span>
                        {item.title}
                      </div>
                      <p className="mt-3 text-base font-semibold text-ink">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-ink/10 bg-gradient-to-r from-slate-50 to-white p-4">
                  <p className="text-xs font-semibold text-ink/50 uppercase tracking-widest">AI Summary</p>
                  <p className="mt-2 text-sm text-ink/70 leading-relaxed">
                    Coverage is strong for parts and labor. Two exclusions apply to water damage and unauthorized repairs.
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white/95 border border-white/70 shadow-lg px-4 py-3 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center">
                    <IconChart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-ink/50 font-semibold">Monthly Insight</p>
                    <p className="text-sm font-semibold text-ink">14% fewer surprises</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroMotion>

      <FadeIn direction="up" delay={0.1}>
        <section className="relative">
          <div className="rounded-[2.5rem] bg-white/90 p-8 md:p-12 lg:p-16 shadow-soft border border-gray-100/70">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <span className="overline-badge mb-4 inline-flex">Trusted by teams</span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
                  Warranty intelligence for modern commerce
                </h2>
                <p className="mt-4 text-ink/60 max-w-2xl">
                  Manufacturers, retailers, and support teams rely on DoNotRisk to reduce claim friction and prevent costly surprises.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {["Nimbus", "Polar", "Vector", "Loop", "Atlas", "Mosaic"].map((logo) => (
                  <div key={logo} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-center text-xs font-semibold tracking-wide text-ink/60">
                    {logo}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { label: "Average claim time", value: "-31%" },
                { label: "Coverage clarity", value: "2.4x" },
                { label: "Renewal confidence", value: "+18%" },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl bg-ink/5 p-5">
                  <p className="text-sm text-ink/50">{item.label}</p>
                  <p className="mt-2 text-2xl font-display font-bold text-ink">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <section className="relative">
          <div
            className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.05) 0%, transparent 60%)" }}
          />
          <div className="rounded-[2.5rem] bg-white p-8 md:p-12 lg:p-16 shadow-soft border border-gray-100/60">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <FadeIn direction="left" delay={0.2}>
                <div className="relative">
                  <div className="aspect-square max-w-md mx-auto">
                    <div
                      className="absolute inset-0 rounded-3xl"
                      style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)" }}
                    />
                    <div className="relative h-full flex items-center justify-center">
                      <motion.div
                        className="w-48 h-48 md:w-64 md:h-64 rounded-3xl flex items-center justify-center shadow-2xl"
                        style={{ background: "linear-gradient(135deg, #0d0f14 0%, #1e1b4b 100%)" }}
                        whileHover={{ rotate: 6, scale: 1.04 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        <IconShield className="h-20 w-20 text-white" />
                      </motion.div>

                      <motion.div
                        className="absolute -top-5 -right-5 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl"
                        style={{ background: "linear-gradient(135deg, #10b981, #0d9488)" }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <IconSpark className="h-7 w-7" />
                      </motion.div>

                      <motion.div
                        className="absolute -bottom-5 -left-5 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <IconShield className="h-6 w-6" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={0.3}>
                <div>
                  <span className="overline-badge mb-5 inline-flex">About the Platform</span>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ink leading-tight">
                    What is <span className="gradient-text">DoNotRisk</span>?
                  </h2>
                  <p className="mt-5 text-lg text-ink/65 leading-relaxed">
                    DoNotRisk is an intelligent warranty management platform that helps you understand, track, and maximize your product warranties. We use advanced AI to scan documents, identify exclusions, and provide risk scores to support better decisions.
                  </p>
                  <ul className="mt-8 space-y-4">
                    {[
                      { icon: <IconShield className="h-5 w-5" />, text: "Warranty risk detection", bgColor: "#7c3aed" },
                      { icon: <IconBrain className="h-5 w-5" />, text: "AI warranty analysis", bgColor: "#3b82f6" },
                      { icon: <IconClock className="h-5 w-5" />, text: "Warranty expiry tracking", bgColor: "#f59e0b" },
                      { icon: <IconBell className="h-5 w-5" />, text: "Claim support insights", bgColor: "#10b981" },
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-4"
                      >
                        <span
                          className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-lg shadow-sm"
                          style={{ background: `${item.bgColor}18`, border: `1.5px solid ${item.bgColor}30`, color: item.bgColor }}
                        >
                          {item.icon}
                        </span>
                        <span className="font-medium text-ink/80">{item.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>
      </FadeIn>
      <FadeIn direction="up" delay={0.1}>
        <section className="relative">
          <div className="text-center mb-16">
            <span className="overline-badge mb-4 inline-flex">Simple Process</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ink">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-lg text-ink/55 max-w-2xl mx-auto">
              Four clear steps to warranty clarity
            </p>
          </div>

          <StaggerContainer stagger={0.12}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { step: 1, title: "Scan Warranty", desc: "Upload or photograph your warranty card using our scanner", icon: <IconScan className="h-7 w-7" />, accentColor: "#3b82f6" },
                { step: 2, title: "AI Reads Terms", desc: "Our AI analyzes warranty terms and conditions", icon: <IconBrain className="h-7 w-7" />, accentColor: "#7c3aed" },
                { step: 3, title: "Exclusions Detected", desc: "Hidden exclusions and risks are identified and scored", icon: <IconSearch className="h-7 w-7" />, accentColor: "#f59e0b" },
                { step: 4, title: "Expiry Tracking", desc: "Get smart reminders before your warranty expires", icon: <IconClock className="h-7 w-7" />, accentColor: "#10b981" },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <div className="group relative p-8 rounded-3xl bg-white border border-gray-100/70 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{ background: `linear-gradient(90deg, ${item.accentColor}, ${item.accentColor}aa)` }}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `linear-gradient(135deg, ${item.accentColor}08 0%, transparent 60%)` }}
                    />

                    <div
                      className="absolute -top-4 left-8 flex h-10 w-10 items-center justify-center rounded-full text-white font-bold text-sm shadow-lg"
                      style={{ background: "linear-gradient(135deg, #0d0f14, #304255)" }}
                    >
                      {item.step}
                    </div>

                    <div className="relative text-center pt-4">
                      <div
                        className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300"
                        style={{ background: `${item.accentColor}12`, border: `1.5px solid ${item.accentColor}25`, color: item.accentColor }}
                      >
                        {item.icon}
                      </div>
                      <h3 className="font-display text-lg font-semibold text-ink mb-2 group-hover:text-primary-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-ink/55 leading-relaxed">{item.desc}</p>
                    </div>

                    {i < 3 && (
                      <div
                        className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px"
                        style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.3), rgba(79,70,229,0.5))" }}
                      />
                    )}
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </section>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <section className="relative">
          <div className="text-center mb-16">
            <span className="overline-badge mb-4 inline-flex">What We Offer</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ink">
              Platform <span className="gradient-text">Features</span>
            </h2>
            <p className="mt-4 text-lg text-ink/55 max-w-2xl mx-auto">
              Premium tools to manage your warranties
            </p>
          </div>

          <StaggerContainer stagger={0.08}>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: <IconScan className="h-6 w-6" />, title: "AI Warranty Scanner", desc: "Scan and analyze warranty documents in seconds with advanced AI", accentColor: "#3b82f6" },
                { icon: <IconChart className="h-6 w-6" />, title: "Risk Score System", desc: "Get comprehensive risk scores based on coverage terms and exclusions", accentColor: "#7c3aed" },
                { icon: <IconBell className="h-6 w-6" />, title: "Expiry Alerts", desc: "Never miss a warranty expiration with smart tracking and reminders", accentColor: "#f59e0b" },
                { icon: <IconShield className="h-6 w-6" />, title: "Category Insights", desc: "Access analytics across product categories and claim trends", accentColor: "#10b981" },
              ].map((feature, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className="group p-8 rounded-3xl bg-white border border-gray-100/70 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `linear-gradient(135deg, ${feature.accentColor}08 0%, transparent 60%)` }}
                    />
                    <div
                      className="absolute top-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{ background: `linear-gradient(90deg, ${feature.accentColor}, ${feature.accentColor}88)` }}
                    />

                    <div
                      className="relative w-14 h-14 rounded-2xl mb-6 flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all duration-300"
                      style={{ background: `${feature.accentColor}12`, border: `1.5px solid ${feature.accentColor}25`, color: feature.accentColor }}
                    >
                      {feature.icon}
                    </div>

                    <h3 className="font-display text-lg font-semibold text-ink mb-3 group-hover:text-primary-700 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-ink/55 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </section>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <section>
          <CapabilitySlider />
        </section>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <section className="relative">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
            <div className="rounded-[2.5rem] bg-white p-10 md:p-12 shadow-soft border border-gray-100/70">
              <span className="overline-badge mb-4 inline-flex">Customer Proof</span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-ink">Teams see clarity in days, not months</h3>
              <p className="mt-4 text-ink/60 leading-relaxed">
                The AI summary removes legal guesswork, and our risk meter helps support teams prep before a claim arrives.
              </p>
              <div className="mt-6 rounded-2xl border border-ink/10 bg-ink/5 p-6">
                <p className="text-base text-ink/80 leading-relaxed">
                  "DoNotRisk made our warranty coverage immediately understandable. We cut escalations by 27% in the first month."
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500" />
                  <div>
                    <p className="text-sm font-semibold text-ink">Avery Lin</p>
                    <p className="text-xs text-ink/50">Director of CX, Atlas Retail</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-gradient-to-br from-[#0d0f14] via-[#1e1b4b] to-[#0f172a] p-10 md:p-12 text-white shadow-premium">
              <span className="overline-badge mb-4 inline-flex" style={{ background: "rgba(255,255,255,0.1)", borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}>
                Security
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-bold">Built for compliance teams</h3>
              <p className="mt-4 text-white/60">Encrypted storage, audit trails, and privacy by default.</p>
              <div className="mt-6 grid gap-3">
                {[
                  "SOC 2 aligned workflows",
                  "Encrypted document vault",
                  "Role-based access control",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
                      <IconShield className="h-4 w-4" />
                    </span>
                    <span className="text-sm text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
      <FadeIn direction="up" delay={0.1}>
        <section className="relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="overline-badge mb-3 inline-flex">Popular</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">Featured Products</h2>
              <p className="mt-2 text-ink/55">Explore products with detailed warranty analysis</p>
            </div>
            <Link
              href="/categories"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              View All Products
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {products.slice(0, 6).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20">
              <div
                className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center mb-6 shadow-soft"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(79,70,229,0.06))" }}
              >
                <IconScan className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink mb-2">No Products Yet</h3>
              <p className="text-ink/55">Products will appear here once added to the platform.</p>
            </div>
          )}
        </section>
      </FadeIn>

      <FadeIn direction="up" delay={0.1}>
        <section className="relative">
          <div
            className="relative overflow-hidden rounded-[2.5rem] p-10 md:p-16 lg:p-20 text-center"
            style={{ background: "linear-gradient(135deg, #0d0f14 0%, #1e1b4b 50%, #0f172a 100%)" }}
          >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, transparent 70%)" }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <div className="absolute inset-0 dot-grid-dark opacity-60" />
              <div
                className="absolute top-0 left-0 right-0 h-px"
                style={{ background: "linear-gradient(90deg, transparent, #7c3aed, #4f46e5, #0d9488, transparent)" }}
              />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border text-sm font-semibold text-white/70"
                style={{ background: "rgba(124,58,237,0.15)", borderColor: "rgba(124,58,237,0.3)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Get Started Today
              </motion.div>

              <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Understand Your <span className="shimmer-text">Warranty Risks?</span>
              </h2>
              <p className="text-lg text-white/60 mb-10 leading-relaxed">
                Start scanning your warranty cards today and get instant AI-powered analysis. It is free to start.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/scanner"
                    className="btn-shimmer inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-semibold text-ink shadow-lg hover:shadow-xl transition-all"
                  >
                    Start Scanning
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-3 rounded-full px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all border"
                    style={{ background: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.2)" }}
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
