"use client";
import React from "react";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export default function FUIBentoGridDark() {
  return (
    <div className="container mx-auto flex flex-col bg-transparent mt-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-6">
        <BentoCard
          eyebrow="Speed"
          title="Built for power users"
          description="Run sub-second portfolio simulations over decades of tick data. Instantly audit allocations using streamlined keyboard shortcuts and active terminal prompts."
          graphic={
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop')" }} 
            />
          }
          className="lg:col-span-2 rounded-2xl"
        />
        <BentoCard
          eyebrow="Source"
          title="Get the furthest reach"
          description="Access over 20 years of split- and dividend-adjusted US equity market data compiled straight from institutional-grade data nodes and APIs."
          graphic={
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop')" }} 
            />
          }
          className="lg:col-span-2 rounded-2xl"
        />
        <BentoCard
          eyebrow="Limitless"
          title="Deploy globally"
          description="Integrate read-only API connectors for Alpaca, Interactive Brokers, and Tradier. Compute allocations on secure decentralized nodes."
          graphic={
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop')" }} 
            />
          }
          className="lg:col-span-2 rounded-2xl"
        />
      </div>
    </div>
  );
}

export function BentoCard({
  dark = false,
  className = "",
  eyebrow,
  title,
  description,
  graphic,
  fade = [],
}: {
  dark?: boolean;
  className?: string;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  graphic?: React.ReactNode;
  fade?: ("top" | "bottom")[];
}) {
  return (
    <motion.div
      initial="idle"
      whileHover="active"
      variants={{ idle: {}, active: {} }}
      data-dark={dark ? "true" : undefined}
      className={clsx(
        className,
        "group relative flex flex-col overflow-hidden bg-surface border border-border-2 hover:border-text-strong/50 transition-all duration-500 shadow-sm hover:shadow-[0_0_30px_rgba(255,255,255,0.06)] hover:[box-shadow:0_-20px_80px_-20px_#ffffff12_inset]",
        "data-[dark]:bg-gray-800"
      )}
    >
      <div className="relative h-[16rem] shrink-0 overflow-hidden bg-bg">
        {graphic}
        {fade.includes("top") && (
          <div className="absolute inset-0 bg-gradient-to-b from-white to-50% group-data-[dark]:from-gray-800 opacity-25" />
        )}
        {fade.includes("bottom") && (
          <div className="absolute inset-0 bg-gradient-to-t from-white to-50% group-data-[dark]:from-gray-800 opacity-25" />
        )}
      </div>
      <div className="relative p-6 z-20 isolate h-[12rem] bg-surface border-t border-border-2 flex flex-col justify-start">
        <span className="font-mono text-[9px] uppercase tracking-widest text-text-3 font-semibold mb-1">{eyebrow}</span>
        <p className="text-sm font-bold tracking-tight text-text-strong uppercase mb-2">
          {title}
        </p>
        <p className="text-[11px] leading-relaxed text-text-2 font-sans font-normal">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
