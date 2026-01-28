import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScanResult } from "@/lib/atsScanner";
import { Calendar, Briefcase, ChevronRight, Hash, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface HistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
}

const HistorySheet = ({
  open,
  onOpenChange,
  history,
  onSelectScan,
}: HistorySheetProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px] border-l-2 border-black bg-white p-0 gap-0">
        {/* Header Section */}
        <SheetHeader className="p-6 border-b-2 border-black bg-slate-50 text-left">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 bg-primary border border-black" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-500">
              Database
            </span>
          </div>
          <SheetTitle className="font-heading text-3xl font-bold uppercase text-black">
            Scan History
          </SheetTitle>
          <SheetDescription className="font-mono text-xs text-slate-600">
            ARCHIVED_ANALYSIS_RECORDS
          </SheetDescription>
        </SheetHeader>

        {/* List Section */}
        <ScrollArea className="h-[calc(100vh-140px)] bg-slate-100/50">
          <div className="p-6">
            {history.length === 0 ? (
              <div className="border-2 border-dashed border-slate-300 p-8 text-center flex flex-col items-center justify-center gap-3">
                <Hash className="w-8 h-8 text-slate-300" />
                <span className="font-mono text-sm font-bold text-slate-400 uppercase">
                  No records found
                </span>
              </div>
            ) : (
              <div className="space-y-4">
                {history.map((scan, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      onSelectScan(scan);
                      onOpenChange(false);
                    }}
                    className={cn(
                      "group relative flex flex-col gap-3 p-5 border-2 border-black bg-white transition-all cursor-pointer",
                      "hover:translate-x-[-2px] hover:translate-y-[-2px] hover:neo-shadow",
                    )}
                  >
                    {/* Top Row: Role & Score */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-heading font-bold text-lg text-black uppercase leading-tight group-hover:underline decoration-2 underline-offset-2">
                          {scan.jobRole}
                        </h4>
                        <span className="inline-block px-2 py-0.5 bg-slate-100 border border-slate-200 text-[10px] font-mono font-bold uppercase tracking-wider">
                          {scan.jobLevel}
                        </span>
                      </div>

                      <div className="flex flex-col items-end">
                        <div
                          className={cn(
                            "text-2xl font-mono font-black border-2 border-black px-2 bg-white",
                            scan.score >= 80
                              ? "text-emerald-600 border-emerald-600"
                              : scan.score >= 60
                                ? "text-amber-600 border-amber-600"
                                : "text-rose-600 border-rose-600",
                          )}
                        >
                          {scan.score}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Row: Date & Meta */}
                    <div className="flex items-center justify-between mt-2 pt-3 border-t-2 border-dotted border-slate-200">
                      <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-500 uppercase">
                        <Calendar className="w-3 h-3" />
                        {scan.date
                          ? format(new Date(scan.date), "dd MMM yyyy • HH:mm")
                          : "UNKNOWN_DATE"}
                      </div>

                      <div className="flex items-center gap-1 group-hover:gap-2 transition-all">
                        <span className="text-[10px] font-mono font-bold text-rose-500 uppercase">
                          {scan.missingKeywords.length} Gaps
                        </span>
                        <ChevronRight className="w-4 h-4 text-black" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default HistorySheet;
