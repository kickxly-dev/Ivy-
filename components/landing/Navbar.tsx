"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Ecosystem", href: "#ecosystem" },
  { label: "Docs", href: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "ivy-glass border-b border-ivy-border"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-7 h-7">
            <div className="absolute inset-0 rounded-lg bg-ivy-green/10 group-hover:bg-ivy-green/20 transition-colors duration-300" />
            <div className="absolute inset-0 flex items-center justify-center">
              <IvyLogo />
            </div>
          </div>
          <span className="text-ivy-text font-semibold tracking-tight text-[15px]">
            Ivy
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3.5 py-1.5 text-sm text-ivy-text-muted hover:text-ivy-text transition-colors duration-200 rounded-md hover:bg-ivy-surface"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="#"
            className="text-sm text-ivy-text-muted hover:text-ivy-text transition-colors duration-200"
          >
            Sign in
          </Link>
          <Link
            href="/core"
            className="px-4 py-1.5 rounded-lg bg-ivy-green text-ivy-black text-sm font-medium hover:bg-ivy-green-dim transition-all duration-200 hover:shadow-[0_0_20px_rgba(74,250,152,0.25)]"
          >
            Get started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-ivy-text-muted hover:text-ivy-text"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden ivy-glass border-b border-ivy-border px-6 pb-4"
          >
            <div className="flex flex-col gap-1 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-3 py-2.5 text-sm text-ivy-text-muted hover:text-ivy-text"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 flex flex-col gap-2">
                <Link href="#" className="px-3 py-2.5 text-sm text-ivy-text-muted">
                  Sign in
                </Link>
                <Link
                  href="/core"
                  className="px-4 py-2 rounded-lg bg-ivy-green text-ivy-black text-sm font-medium text-center"
                >
                  Get started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function IvyLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z"
        stroke="#4afa98"
        strokeWidth="1.2"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M8 5L11 6.75V10.25L8 12L5 10.25V6.75L8 5Z"
        fill="#4afa98"
        fillOpacity="0.3"
      />
    </svg>
  );
}
