import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen w-full overflow-hidden relative">
      <div
        className={`container mx-auto px-4 ${
          isMobile ? "py-6" : "py-12"
        } relative z-10`}
      >
        <header className={`mb-${isMobile ? "4" : "8"} text-center`}>
          <div className="inline-block animate-float">
            <h1
              className={`${
                isMobile ? "text-3xl" : "text-4xl md:text-5xl"
              } font-bold bg-clip-text text-transparent bg-purple-pink-gradient animate-bg-pan`}
            >
              ResuScanner.AI
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto text-sm md:text-base">
              AI-powered resume analyzer that helps you optimize your resume for
              ATS systems
            </p>
          </div>
        </header>
        <main>{children}</main>
        <footer
          className={`mt-${
            isMobile ? "10" : "16"
          } text-center text-xs md:text-sm text-muted-foreground`}
        >
          <p>
            &copy; {new Date().getFullYear()} ResuScanner.AI - Made by Priyansu
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
