"use client";

import { motion } from "framer-motion";

export default function CyberBackground({ children }: any) {
  return (
    <div className="h-screen w-full relative overflow-hidden text-white">
      {/* Animated Gradient */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 20% 20%, #0ea5e9 0%, #020617 40%)",
            "radial-gradient(circle at 80% 30%, #06b6d4 0%, #020617 40%)",
            "radial-gradient(circle at 50% 80%, #22c55e 0%, #020617 40%)",
          ],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      {/* Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e933_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e933_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Glow blobs */}
      <motion.div
        className="absolute w-72 h-72 bg-cyan-500 rounded-full blur-3xl opacity-20"
        animate={{ x: [0, 200, -100], y: [0, -150, 100] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        className="absolute w-72 h-72 bg-green-500 rounded-full blur-3xl opacity-20 right-0"
        animate={{ x: [0, -200, 100], y: [0, 150, -100] }}
        transition={{ duration: 12, repeat: Infinity }}
      />

      {/* CONTENT */}
      <div className="relative z-10 flex items-center justify-center h-full">
        {children}
      </div>
    </div>
  );
}
