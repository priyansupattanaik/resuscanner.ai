import React from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { Toaster } from "@/components/ui/sonner";
import { Toaster as UIToaster } from "@/components/ui/toaster";
import Background from "./Background";
import { LayoutDashboard } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      <Background />

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Mobile Header (Visible only on Mobile) */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">
              ResuScanner
            </span>
          </div>
          <MobileNav />
        </div>

        <div className="flex-1 overflow-y-auto scroll-smooth">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-12">
            {children}
          </div>
        </div>
      </main>

      <Toaster />
      <UIToaster />
    </div>
  );
};

export default Layout;
