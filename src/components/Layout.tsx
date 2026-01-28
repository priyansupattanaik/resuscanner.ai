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
    <div className="min-h-screen flex font-sans text-slate-900 selection:bg-primary selection:text-white">
      <Background />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-background border-b-2 border-black sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary border-2 border-black flex items-center justify-center neo-shadow-sm">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-black tracking-tighter uppercase">
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
