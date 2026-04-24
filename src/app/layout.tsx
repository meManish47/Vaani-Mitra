"use client";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import React, { useState, useEffect } from "react";
import Sidebar from "@/app/components/Navbar";
import { Menu } from "lucide-react";
import { motion } from "framer-motion";

const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "Vaani Mitra",
//   description: "Misarticulation therapy",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("vaanimitra_theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen flex ${
          isDarkMode
            ? "dark bg-gray-900"
            : "bg-gradient-to-br from-sky-50 via-purple-50 to-pink-50"
        }`}
      >
        {/* Theme + Font Styling */}
        <style>{`
          :root {
            --color-primary: #8B5CF6;
            --color-secondary: #38BDF8;
            --color-accent: #F472B6;
            --color-success: #4ADE80;
            --color-warning: #FBBF24;
          }
          
          .dark {
            --color-primary: #A78BFA;
            --color-secondary: #7DD3FC;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }

          * {
            font-family: 'Nunito', 'Comic Neue', system-ui, sans-serif;
          }
        `}</style>

        {/* Sidebar */}
        <Sidebar
          currentPage="" // You can pass dynamic page name here later
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 min-h-screen overflow-x-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-100 px-4 py-3 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl">🗣️</span>
              <span className="font-bold text-purple-600">VaaniMitra</span>
            </div>

            <div className="w-10" />
          </div>

          {/* Page children */}
          <motion.div
            className="p-4 md:p-6 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>

          {/* Animated floating emoji */}
          <div className="fixed bottom-10 right-10 pointer-events-none hidden lg:block">
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-4xl opacity-20"
            >
              🎈
            </motion.div>
          </div>
        </main>
      </body>
    </html>
  );
}
