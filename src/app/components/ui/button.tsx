"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // I'll provide this helper below if you don't have it

const baseStyles = `
  inline-flex items-center justify-center font-medium
  rounded-xl transition-all duration-200
  focus:outline-none focus:ring-2 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
`;

const variants = {
  default:
    "bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-300",
  outline:
    "border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-gray-300",
  ghost: "text-gray-700 hover:bg-gray-100",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  animated?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "md", animated = false, ...props }, ref) => {
    if (animated) {
      return (
        <motion.button
          ref={ref}
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          whileTap={{ scale: 0.95 }}
          {...(props as any)}
        />
      );
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
