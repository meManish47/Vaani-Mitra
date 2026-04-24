"use client";
import React from "react";
// import { Link } from 'react-router-dom';

import { Home, Type, Brain, User, Settings } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface NavbarProps {
  currentPage?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Navbar({ currentPage = "", isOpen = true, onClose }: NavbarProps) {
  const navItems = [
    { id: "/", icon: Home, label: "Home" },
    { id: "user/characters", icon: Type, label: "Characters" },
    { id: "user/startquiz", icon: Brain, label: "Quiz" },
    { id: "Profile", icon: User, label: "Profile" },
    // { id: "user/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-24 bg-white shadow-xl flex flex-col items-center py-8 gap-6
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="mb-4">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-sky-400 to-purple-500 rounded-3xl flex items-center justify-center shadow-lg"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-3xl">🗣️</span>
          </motion.div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-4 w-full px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              (() => {
                const href = item.id.startsWith("/") ? item.id : `/${item.id.toLowerCase()}`;
                return (
              <Link
                href={href}
                key={item.id}
                onClick={onClose}
              >
                <motion.div
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${
                    isActive
                      ? "bg-gradient-to-br from-sky-400 to-purple-500 text-white shadow-lg"
                      : "text-slate-600 hover:bg-purple-50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={24} />
                  <span className="text-xs font-medium">{item.label}</span>
                </motion.div>
              </Link>
                );
              })()
            );
          })}
        </nav>

        {/* Bottom decoration */}
        <div className="mt-auto flex flex-col items-center gap-2">
          {["⭐", "✨"].map((star, i) => (
            <motion.span
              key={i}
              className="text-xl opacity-50"
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
              }}
            >
              {star}
            </motion.span>
          ))}
        </div>
      </aside>
    </>
  );
}
