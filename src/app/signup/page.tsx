"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/apiClient";
import { motion } from "framer-motion";

export default function SignupPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    if (!user.email || !user.username || !user.password) return;

    try {
      setLoading(true);
      const response = await api.post("/api/users/signup", user);
      console.log("Signup success", response.data);
      router.push("/login");
    } catch (error: any) {
      alert("Signup failed ❌ Try again!");
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password && user.username));
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 via-pink-100 to-sky-100 px-4">

      <motion.div
        className="w-full max-w-md bg-white rounded-3xl p-8 shadow-lg border border-purple-200"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >

        {/* Home Button */}
        <Link href="/" className="text-purple-600 underline text-sm mb-4 block">
          ⬅ Home
        </Link>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {loading ? "Processing..." : "Create Account"}
        </h2>

        {/* Username Input */}
        <label className="font-medium text-gray-700 text-sm" htmlFor="username">
          Username
        </label>
        <input
          id="username"
          type="text"
          placeholder="Enter username"
          className="mt-1 mb-4 w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 outline-none"
          value={user.username}
          onChange={(e) => setUser({ ...user, username: e.target.value })}
        />

        {/* Email Input */}
        <label className="font-medium text-gray-700 text-sm" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Enter email"
          className="mt-1 mb-4 w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 outline-none"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />

        {/* Password Input */}
        <label className="font-medium text-gray-700 text-sm" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          placeholder="Enter password"
          className="mt-1 mb-6 w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 text-gray-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-300 outline-none"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />

        {/* Signup Button */}
        <button
          onClick={onSignup}
          disabled={buttonDisabled || loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
            buttonDisabled || loading
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600 active:bg-purple-700"
          }`}
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-600 font-semibold hover:text-purple-800">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
