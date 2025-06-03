// src/components/Layout.tsx
import React from "react";
import { motion } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* 타이틀 영역 */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, ease: "easeOut" }}
        className=" py-6"
      >
        <h1 className="text-4x1 md:text-5xl font-semibold text-center">
          What’s Today Menu
        </h1>
      </motion.div>

      {/* 메인 컨텐츠는 Layout을 쓰는 곳(App)에서 children으로 전달 */}
      <div className="flex-1 px-4">{children}</div>
    </div>
  );
}
