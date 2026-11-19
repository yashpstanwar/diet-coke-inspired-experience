"use client";

import React from "react";
import Image from "next/image";

export const Watermark: React.FC = () => {
  return (
    <aside
      aria-label="Site Credits"
      className="fixed bottom-3 right-3 sm:bottom-5 sm:right-5 z-50 select-none pointer-events-auto"
    >
      <a
        href="https://www.instagram.com/automations.ninja?psln=ZHJ5ZXM5aTNyeHM5"
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#0c0b10]/80 hover:bg-[#161420]/95 backdrop-blur-md border border-white/10 hover:border-amber-400/40 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_25px_rgba(242,165,26,0.3)] transition-all duration-300 ease-out hover:scale-105 active:scale-95 cursor-pointer touch-manipulation focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        aria-label="Powered by Automations Ninja (opens in new tab)"
      >
        <span className="text-[10px] sm:text-xs font-sans font-medium tracking-tight text-zinc-400 group-hover:text-zinc-200 transition-colors">
          Powered by
        </span>

        <div className="relative flex items-center justify-center">
          <Image
            src="/automations-ninja-logo.png"
            alt="Automations Ninja"
            width={48}
            height={23}
            priority
            className="h-3.5 sm:h-5 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_6px_rgba(242,165,26,0.35)]"
          />
        </div>

        <svg
          className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-zinc-500 group-hover:text-amber-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
          />
        </svg>
      </a>
    </aside>
  );
};

export default Watermark;
