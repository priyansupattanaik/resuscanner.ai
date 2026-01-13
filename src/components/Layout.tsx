import React from "react";
import Background from "./Background";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 selection:bg-blue-500/10">
      {/* Dynamic Background */}
      <Background />

      {/* Minimal Frosted Header 
        - Sticky positioning
        - Heavy backdrop blur (blur-2xl)
        - Subtle border (white/20)
      */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-2xl transition-all duration-300">
        <div className="mx-auto max-w-5xl h-14 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 select-none">
            {/* Minimal Typographic Logo */}
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">
              ResuScanner
              <span className="text-slate-400 font-normal ml-0.5">.AI</span>
            </span>
          </div>

          {/* Status Indicator (Purely decorative minimalism) */}
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/50 animate-pulse" />
            <span className="text-xs font-medium text-slate-400">Ready</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 relative z-10">
        <div className="animate-fade-in">{children}</div>
      </main>

      {/* Footer - Bare essentials */}
      <footer className="py-8 mt-auto border-t border-white/20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[11px] font-medium text-slate-400 tracking-wide">
            DESIGNED FOR EXCELLENCE
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
