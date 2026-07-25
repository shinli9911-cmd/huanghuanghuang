import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion";
import "./GradientText.css";

export default function GradientText({
  children,
  className = "",
  colors = ["#5227FF", "#FF9FFC", "#B497CF"],
  animationSpeed = 8,
  direction = "horizontal",
  pauseOnHover = false,
  yoyo = true,
}) {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsedRef = useRef(0);
  const lastTimeRef = useRef(null);
  const duration = animationSpeed * 1000;

  useAnimationFrame((time) => {
    if (isPaused) { lastTimeRef.current = null; return; }
    if (lastTimeRef.current === null) { lastTimeRef.current = time; return; }
    elapsedRef.current += time - lastTimeRef.current;
    lastTimeRef.current = time;
    if (yoyo) {
      const fullCycle = duration * 2;
      const cycleTime = elapsedRef.current % fullCycle;
      progress.set(cycleTime < duration ? (cycleTime / duration) * 100 : 100 - ((cycleTime - duration) / duration) * 100);
    } else {
      progress.set((elapsedRef.current / duration) * 100);
    }
  });

  useEffect(() => { elapsedRef.current = 0; progress.set(0); }, [animationSpeed, progress, yoyo]);

  const backgroundPosition = useTransform(progress, (value) => direction === "vertical" ? `50% ${value}%` : `${value}% 50%`);
  const gradientAngle = direction === "horizontal" ? "to right" : direction === "vertical" ? "to bottom" : "to bottom right";
  const gradientStyle = { backgroundImage: `linear-gradient(${gradientAngle}, ${[...colors, colors[0]].join(", ")})`, backgroundSize: direction === "horizontal" ? "300% 100%" : direction === "vertical" ? "100% 300%" : "300% 300%", backgroundRepeat: "repeat" };
  const pause = useCallback(() => pauseOnHover && setIsPaused(true), [pauseOnHover]);
  const resume = useCallback(() => pauseOnHover && setIsPaused(false), [pauseOnHover]);

  return <motion.span className={`animated-gradient-text ${className}`} onMouseEnter={pause} onMouseLeave={resume}>
    <motion.span className="text-content" style={{ ...gradientStyle, backgroundPosition }}>{children}</motion.span>
  </motion.span>;
}
