"use client";

import { motion } from "framer-motion";

interface AnimatedUnderlineProps {
  color?: string;
  delay?: number;
}

const AnimatedUnderline = ({ color = "currentColor", delay = 0.5 }: AnimatedUnderlineProps) => {
  return (
    <motion.svg
      className="absolute bottom-0 left-0 w-full h-3"
      viewBox="0 0 200 10"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.path
        d="M 2 6 C 50 10 150 -2 198 4"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "circOut", delay }}
      />
    </motion.svg>
  );
};

export default AnimatedUnderline; 