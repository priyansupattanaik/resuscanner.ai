import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import Background from "@/components/Background";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-sans text-center relative overflow-hidden">
      <Background />

      <div className="bg-white border-2 border-black p-12 neo-shadow max-w-lg w-full relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-primary border-2 border-black flex items-center justify-center mb-6 neo-shadow">
          <AlertTriangle className="w-8 h-8 text-white" />
        </div>

        <h1 className="font-heading text-6xl font-bold text-black mb-2">404</h1>
        <div className="h-1 w-20 bg-black mb-6" />

        <p className="font-mono text-lg text-slate-600 mb-8 uppercase tracking-wide">
          Page_Not_Found
        </p>

        <Link
          to="/"
          className="flex items-center gap-2 px-8 py-3 bg-black text-white font-mono font-bold text-sm uppercase tracking-wider border-2 border-black hover:bg-white hover:text-black transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Base
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
