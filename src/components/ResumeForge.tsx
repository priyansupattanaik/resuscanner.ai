import React, { useState } from "react";
import { forgeBulletPoint } from "@/lib/forge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Hammer, ArrowRight, Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ResumeForgeProps {
  jobRole: string;
}

const ResumeForge = ({ jobRole }: ResumeForgeProps) => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleForge = async () => {
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const result = await forgeBulletPoint(input, jobRole);
      setOutput(result);
      toast.success("Bullet point forged successfully");
    } catch (e) {
      toast.error("Forge failed");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-1">
      {/* Header */}
      <div className="bg-black text-white p-6 border-2 border-black neo-shadow">
        <div className="flex items-center gap-3 mb-2">
          <Hammer className="w-6 h-6 text-primary" />
          <h2 className="font-heading font-bold text-2xl uppercase tracking-tight">
            Resume Forge
          </h2>
        </div>
        <p className="font-mono text-sm text-slate-300">
          Transform weak "duties" into high-impact "achievements".
        </p>
      </div>

      <div className="grid gap-6">
        {/* Input Section */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Original Bullet Point
          </label>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Responsible for managing the sales team and increasing revenue..."
            className="min-h-[100px] rounded-none border-2 border-slate-300 focus:border-black focus:ring-0 font-sans text-sm p-4 resize-none"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleForge}
            disabled={isLoading || !input}
            className={cn(
              "w-full h-12 rounded-none bg-primary text-white font-bold uppercase tracking-wider border-2 border-black transition-all",
              "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none neo-shadow",
              isLoading && "opacity-70 cursor-not-allowed",
            )}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 animate-spin" /> Forging...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Hammer className="w-4 h-4" /> Forge Impact
              </span>
            )}
          </Button>
        </div>

        {/* Output Section */}
        {output && (
          <div className="space-y-2 animate-slide-in">
            <label className="text-xs font-bold uppercase tracking-widest text-emerald-600 flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> TAS Optimization
            </label>
            <div className="relative bg-emerald-50 border-2 border-emerald-500 p-6">
              <p className="font-heading font-bold text-lg text-emerald-950 leading-relaxed">
                "{output}"
              </p>

              <button
                onClick={copyToClipboard}
                className="absolute top-0 right-0 p-2 bg-emerald-500 text-white border-l-2 border-b-2 border-emerald-700 hover:bg-emerald-600 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[10px] font-mono text-slate-400 text-center">
              *Fill in any [bracketed] metrics with your real data.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForge;
