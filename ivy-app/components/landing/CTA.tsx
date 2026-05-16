"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 ivy-grid opacity-40" />

      {/* Radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[400px] bg-ivy-green/[0.06] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-3xl border border-ivy-border-light bg-ivy-surface overflow-hidden"
        >
          {/* Top border highlight */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-ivy-green/40 to-transparent" />

          {/* Background pattern */}
          <div className="absolute inset-0 ivy-grid opacity-60" />

          {/* Inner glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-ivy-green/[0.04] rounded-full blur-[60px]" />

          <div className="relative px-8 py-16 md:px-16 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-ivy-green/20 bg-ivy-green/5 text-ivy-green text-xs font-medium tracking-wide mb-8"
            >
              <Sparkles size={11} />
              Start building with Ivy
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              <span className="text-ivy-text">The future of</span>
              <br />
              <span className="ivy-gradient-green">AI computing</span>
              <br />
              <span className="text-ivy-text">starts here.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="text-ivy-text-muted text-lg max-w-lg mx-auto mb-10 leading-relaxed"
            >
              Join thousands of teams using Ivy to build, automate, and scale
              with AI. Request early access today.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="flex flex-col sm:flex-row gap-3 justify-center items-center"
            >
              <Link
                href="/core"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-xl bg-ivy-green text-ivy-black font-semibold text-sm hover:bg-ivy-green-dim transition-all duration-300 hover:shadow-[0_0_40px_rgba(74,250,152,0.35)] hover:-translate-y-0.5"
              >
                Get early access
                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="#"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl border border-ivy-border text-ivy-text-subtle text-sm hover:border-ivy-border-light hover:text-ivy-text transition-all duration-300"
              >
                View documentation
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-6 text-xs text-ivy-text-muted"
            >
              No credit card required · Free tier available · Cancel anytime
            </motion.p>
          </div>

          {/* Bottom border highlight */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-px bg-gradient-to-r from-transparent via-ivy-border-light to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
