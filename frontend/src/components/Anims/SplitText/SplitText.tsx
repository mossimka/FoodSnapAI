"use client";

import { animate, stagger } from "motion";
import { splitText } from "motion-plus";
import { useEffect, useRef } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
}

export default function SplitText({ text, className }: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.fonts.ready.then(() => {
      if (!containerRef.current) return;

      containerRef.current.style.visibility = "visible";

      const { words } = splitText(
        containerRef.current.querySelector("h1")!
      );

      animate(
        words,
        { opacity: [0, 1], y: [10, 0] },
        {
            type: "spring",
            duration: 2,
            bounce: 0,
            delay: stagger(0.05),
        }
      );
    });
  }, []);

  return (
    <div className={className} ref={containerRef} style={{ visibility: "hidden" }}>
      <h1 className="gradientText">{text}</h1>
    </div>
  );  
}
