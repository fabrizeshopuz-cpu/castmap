"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { DashboardSection } from "@/components/landing/DashboardPreview";
import { StatsSection } from "@/components/landing/StatsSection";
import { IndustriesSection } from "@/components/landing/IndustriesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { DemoModal } from "@/components/landing/DemoModal";

export function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const previousTheme = document.documentElement.dataset.theme;
    document.documentElement.dataset.theme = "dark";
    return () => {
      if (previousTheme) {
        document.documentElement.dataset.theme = previousTheme;
      } else {
        delete document.documentElement.dataset.theme;
      }
    };
  }, []);

  const requestDemo = () => setDemoOpen(true);
  const submitDemo = () => {
    setDemoOpen(false);
    setToast(true);
    window.setTimeout(() => setToast(false), 2800);
  };

  return (
    <main className="gradient-background relative min-h-screen overflow-hidden text-[#F8FAFC]">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 digital-grid" />
        <div className="absolute inset-x-0 top-0 h-[760px] bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.14),transparent_58%)]" />
        <div className="absolute left-[-10%] top-24 h-[520px] w-[520px] rounded-full bg-[#3B82F6]/15 blur-3xl" />
        <div className="absolute left-0 top-40 h-[1px] w-full bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      </div>
      <Navbar onDemo={requestDemo} />
      <Hero onDemo={requestDemo} />
      <ProblemSection />
      <SolutionSection />
      <DashboardSection />
      <StatsSection />
      <IndustriesSection />
      <HowItWorks />
      <FinalCTA onDemo={requestDemo} />
      <Footer />
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} onSubmit={submitDemo} />
      <AnimatePresence>
        {toast ? (
          <motion.div
            className="glass-panel fixed bottom-6 left-1/2 z-[120] -translate-x-1/2 rounded-lg border-[#D4AF37]/40 px-5 py-3 text-sm font-black text-[#F8FAFC] shadow-[0_0_40px_rgba(212,175,55,0.24)] backdrop-blur"
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
          >
            So'rovingiz qabul qilindi
          </motion.div>
        ) : null}
      </AnimatePresence>
    </main>
  );
}
