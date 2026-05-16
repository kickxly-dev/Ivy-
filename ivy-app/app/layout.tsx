import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ivy — The AI-Native Workspace",
  description:
    "Ivy is the operating layer for modern AI computing. An AI-native workspace that unifies intelligence, cloud infrastructure, and intelligent workflows.",
  keywords: ["AI workspace", "AI platform", "productivity", "cloud", "automation"],
  openGraph: {
    title: "Ivy — The AI-Native Workspace",
    description: "The operating layer for modern AI computing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
        <body className="min-h-screen bg-ivy-black text-ivy-text antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
