import React from "react";
import Background from "./Background";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen font-sans text-slate-900 selection:bg-blue-100/50">
      {/* Dynamic Mesh Background */}
      <Background />

      {/* Glass Header */}
      <header className="sticky top-4 z-50 mx-auto max-w-7xl px-4">
        <div className="glass-panel rounded-2xl px-6 h-16 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg shadow-blue-500/20 flex items-center justify-center text-white font-bold text-lg">
              R
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-800">
              ResuScanner<span className="text-blue-600">.AI</span>
            </h1>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-blue-600 transition-colors">
              How it Works
            </a>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Pricing
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="mt-auto py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-xs font-medium">
          <p>
            © {new Date().getFullYear()} ResuScanner.AI. Powered by Apple-style
            Design.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
