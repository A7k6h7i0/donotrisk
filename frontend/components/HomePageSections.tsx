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

export function HomePageSections({ products }: HomePageSectionsProps) {
  return (
    <div className="space-y-28 lg:space-y-36">

      {/* ── Hero ──────────────────────────────────────────── */}
      <HeroMotion>
        <div className="px-6 py-14 md:px-14 md:py-24 lg:py-32">
          <div className="max-w-4xl">
            {/* Overline badge */}
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
              <span className="text-sm font-semibold text-white/85 tracking-wide">AI-Powered Warranty Analysis</span>
            </motion.div>

            {/* Heading */}
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl xl:text-[4.5rem] font-bold text-white leading-[1.1] tracking-tight">
              <TextReveal text="Understand Warranty Risk" delay={0.2} stagger={0.06} />
              {" "}
              <span className="relative inline-block">
                <TextReveal
                  text="Before It Costs You"
                  delay={0.5}
                  stagger={0.06}
                  className="relative z-10"
                />
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
              Scan warranty cards, decode terms, evaluate exclusions, and track expiry timelines for products across electronics, vehicles, home appliances, and more.
            </motion.p>

            <HomeActions />

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="mt-16 pt-8 border-t border-white/10"
            >
              <div className="grid grid-cols-3 gap-8">
                {[
                  { value: 10000, suffix: "+", label: "Products Analyzed" },
                  { value: 98,    suffix: "%", label: "Accuracy Rate"     },
                  { value: 5000,  suffix: "+", label: "Happy Users"       },
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
        </div>
      </HeroMotion>

      {/* ── What is DoNotRisk ─────────────────────────────── */}
      <FadeIn direction="up" delay={0.1}>
        <section className="relative">
          <div
            className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.05) 0%, transparent 60%)" }}
          />
          <div className="rounded-[2.5rem] bg-white p-8 md:p-12 lg:p-16 shadow-soft border border-gray-100/60">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Visual side */}
              <FadeIn direction="left" delay={0.2}>
                <div className="relative">
                  <div className="aspect-square max-w-md mx-auto">
                    <div className="absolute inset-0 rounded-3xl"
                      style={{ background: "radial-gradient(ellipse at center, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />
                    <div className="relative h-full flex items-center justify-center">
                      <motion.div
                        className="w-48 h-48 md:w-64 md:h-64 rounded-3xl flex items-center justify-center shadow-2xl"
                        style={{ background: "linear-gradient(135deg, #0d0f14 0%, #1e1b4b 100%)" }}
                        whileHover={{ rotate: 6, scale: 1.04 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      >
                        <svg className="w-24 h-24 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                        </svg>
                      </motion.div>

                      <motion.div
                        className="absolute -top-5 -right-5 w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-xl"
                        style={{ background: "linear-gradient(135deg, #10b981, #0d9488)" }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        ✓
                      </motion.div>

                      <motion.div
                        className="absolute -bottom-5 -left-5 w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-xl"
                        style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Content side */}
              <FadeIn direction="right" delay={0.3}>
                <div>
                  <span className="overline-badge mb-5 inline-flex">About the Platform</span>
                  <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ink leading-tight">
                    What is{" "}
                    <span className="gradient-text">DoNotRisk</span>
                    <span className="text-ink">?</span>
                  </h2>
                  <p className="mt-5 text-lg text-ink/65 leading-relaxed">
                    DoNotRisk is an intelligent warranty management platform that helps you understand, track, and maximize your product warranties. We use advanced AI to scan warranty documents, identify hidden exclusions, and provide risk scores to help you make informed purchasing decisions.
                  </p>
                  <ul className="mt-8 space-y-4">
                    {[
                      { icon: "🛡️", text: "Warranty risk detection",  bgColor: "#7c3aed" },
                      { icon: "🤖", text: "AI warranty analysis",     bgColor: "#3b82f6" },
                      { icon: "⏰", text: "Warranty expiry tracking",  bgColor: "#f59e0b" },
                      { icon: "💬", text: "Claim support insights",    bgColor: "#10b981" },
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
                          style={{ background: `${item.bgColor}18`, border: `1.5px solid ${item.bgColor}30` }}
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

      {/* ── How It Works ─────────────────────────────────── */}
      <FadeIn direction="up" delay={0.1}>
        <section className="relative">
          <div className="text-center mb-16">
            <span className="overline-badge mb-4 inline-flex">Simple Process</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ink">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="mt-4 text-lg text-ink/55 max-w-2xl mx-auto">
              Four simple steps to warranty clarity
            </p>
          </div>

          <StaggerContainer stagger={0.12}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { step: 1, title: "Scan Warranty",       desc: "Upload or photograph your warranty card using our scanner",  icon: "📷", accentColor: "#3b82f6" },
                { step: 2, title: "AI Reads Terms",      desc: "Our AI analyzes the warranty terms and conditions",          icon: "🤖", accentColor: "#7c3aed" },
                { step: 3, title: "Exclusions Detected", desc: "Hidden exclusions and risks are identified and scored",      icon: "🔍", accentColor: "#f59e0b" },
                { step: 4, title: "Expiry Tracking",     desc: "Get smart reminders before your warranty expires",          icon: "⏰", accentColor: "#10b981" },
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <div className="group relative p-8 rounded-3xl bg-white border border-gray-100/70 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                    <div
                      className="absolute top-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{ background: `linear-gradient(90deg, ${item.accentColor}, ${item.accentColor}aa)` }}
                    />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `linear-gradient(135deg, ${item.accentColor}08 0%, transparent 60%)` }} />

                    <div
                      className="absolute -top-4 left-8 flex h-10 w-10 items-center justify-center rounded-full text-white font-bold text-sm shadow-lg"
                      style={{ background: "linear-gradient(135deg, #0d0f14, #304255)" }}
                    >
                      {item.step}
                    </div>

                    <div className="relative text-center pt-4">
                      <div
                        className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 group-hover:shadow-md transition-all duration-300"
                        style={{ background: `${item.accentColor}12`, border: `1.5px solid ${item.accentColor}25` }}
                      >
                        {item.icon}
                      </div>
                      <h3 className="font-display text-lg font-semibold text-ink mb-2 group-hover:text-primary-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-ink/55 leading-relaxed">{item.desc}</p>
                    </div>

                    {i < 3 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px"
                        style={{ background: "linear-gradient(90deg, rgba(124,58,237,0.3), rgba(79,70,229,0.5))" }} />
                    )}
                  </div>
                </StaggerItem>
              ))}
            </div>
          </StaggerContainer>
        </section>
      </FadeIn>

      {/* ── Platform Features ─────────────────────────────── */}
      <FadeIn direction="up" delay={0.1}>
        <section className="relative">
          <div className="text-center mb-16">
            <span className="overline-badge mb-4 inline-flex">What We Offer</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-ink">
              Platform <span className="gradient-text">Features</span>
            </h2>
            <p className="mt-4 text-lg text-ink/55 max-w-2xl mx-auto">
              Powerful tools to manage your warranties
            </p>
          </div>

          <StaggerContainer stagger={0.08}>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: "📷", title: "AI Warranty Scanner",  desc: "Scan and analyze warranty documents in seconds with advanced AI",               accentColor: "#3b82f6" },
                { icon: "📊", title: "Risk Score System",    desc: "Get comprehensive risk scores based on warranty terms, exclusions, and coverage", accentColor: "#7c3aed" },
                { icon: "🔔", title: "Expiry Alerts",        desc: "Never miss a warranty expiration with smart tracking and timely reminders",        accentColor: "#f59e0b" },
                { icon: "📈", title: "Category Insights",    desc: "Access insights and analytics across different product categories",               accentColor: "#10b981" },
              ].map((feature, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    className="group p-8 rounded-3xl bg-white border border-gray-100/70 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `linear-gradient(135deg, ${feature.accentColor}08 0%, transparent 60%)` }} />
                    <div
                      className="absolute top-0 left-0 right-0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
                      style={{ background: `linear-gradient(90deg, ${feature.accentColor}, ${feature.accentColor}88)` }}
                    />

                    <div
                      className="relative w-14 h-14 rounded-2xl mb-6 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:shadow-md transition-all duration-300"
                      style={{ background: `${feature.accentColor}12`, border: `1.5px solid ${feature.accentColor}25` }}
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

      {/* ── Capability Slider ─────────────────────────────── */}
      <FadeIn direction="up" delay={0.1}>
        <section>
          <CapabilitySlider />
        </section>
      </FadeIn>

      {/* ── Featured Products ─────────────────────────────── */}
      <FadeIn direction="up" delay={0.1}>
        <section className="relative">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <span className="overline-badge mb-3 inline-flex">Popular</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-ink">
                Featured Products
              </h2>
              <p className="mt-2 text-ink/55">
                Explore products with detailed warranty analysis
              </p>
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
                className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-soft"
                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(79,70,229,0.06))" }}
              >
                📦
              </div>
              <h3 className="font-display text-xl font-semibold text-ink mb-2">No Products Yet</h3>
              <p className="text-ink/55">Products will appear here once added to the platform.</p>
            </div>
          )}
        </section>
      </FadeIn>

      {/* ── CTA ──────────────────────────────────────────── */}
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
                Ready to Understand Your{" "}
                <span className="shimmer-text">Warranty Risks?</span>
              </h2>
              <p className="text-lg text-white/60 mb-10 leading-relaxed">
                Start scanning your warranty cards today and get instant AI-powered analysis — it&apos;s free to start.
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
