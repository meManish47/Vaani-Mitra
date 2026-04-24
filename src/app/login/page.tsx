"use client";

import api from "@/lib/apiClient";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    if (!user.email || !user.password) return;

    try {
      setLoading(true);
      const response = await api.post("/api/users/login", user);
      console.log("Login success", response.data);
      router.push("/profile");
    } catch (error) {
      alert("Invalid credentials ❌ Try again!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-sky-100 px-4">
      <motion.div
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg border border-purple-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Home Link */}
        <Link href="/" className="text-purple-600 underline text-sm mb-4 block">
          ⬅ Home
        </Link>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {loading ? "Processing..." : "Login"}
        </h2>

        {/* Email */}
        <label className="font-medium text-gray-700 text-sm" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          className="mt-1 mb-4 w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 outline-none"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        {/* Password */}
        <label className="font-medium text-gray-700 text-sm" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter your password"
          className="mt-1 mb-6 w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 outline-none"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />

        {/* Login Button */}
        <button
          onClick={onLogin}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
            loading
              ? "bg-purple-400 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600 active:bg-purple-700"
          }`}
        >
          {loading ? "Please wait..." : "Log in"}
        </button>

        {/* Signup Redirect */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-purple-600 font-semibold hover:text-purple-800"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
