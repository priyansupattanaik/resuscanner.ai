import React from "react";
import { useScan } from "@/context/ScanContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlusCircle,
  History,
  LayoutDashboard,
  Trash2,
  ChevronRight,
  ArchiveX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavContentProps {
  onNavigate?: () => void;
}

const NavContent = ({ onNavigate }: NavContentProps) => {
  const {
    history,
    loadScanFromHistory,
    deleteScan,
    clearHistory,
    resetScan,
    result,
  } = useScan();

  const handleDelete = (e: React.MouseEvent, date: string) => {
    e.stopPropagation();
    if (confirm("Delete this record?")) {
      deleteScan(date);
    }
  };

  const handleNewScan = () => {
    resetScan();
    onNavigate?.();
  };

  const handleSelectHistory = (scan: any) => {
    loadScanFromHistory(scan);
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full bg-background font-sans">
      {/* Header */}
      <div className="p-6 border-b-2 border-black flex-shrink-0 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-black flex items-center justify-center neo-shadow">
            <LayoutDashboard className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold text-xl text-black tracking-tight uppercase">
            ResuScanner
          </span>
        </div>

        <Button
          onClick={handleNewScan}
          className="w-full justify-between h-10 bg-white text-black border-2 border-black neo-shadow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-200 active:bg-slate-100"
        >
          <span className="font-bold flex items-center gap-2 text-sm uppercase">
            <PlusCircle className="w-4 h-4" />
            New Scan
          </span>
          <ChevronRight className="w-3 h-3" />
        </Button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-[#f8f8f8]">
        <div className="px-6 py-4 flex-shrink-0 flex items-center justify-between border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <History className="w-3 h-3" />
            History
          </h3>
          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-[10px] font-bold text-slate-400 hover:text-red-600 uppercase transition-colors flex items-center gap-1"
            >
              <ArchiveX className="w-3 h-3" /> Clear All
            </button>
          )}
        </div>

        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-3 pb-6">
            {history.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <p className="text-sm font-medium text-slate-400">
                  Empty History
                </p>
              </div>
            ) : (
              history.map((scan, idx) => {
                const isSelected = result?.date === scan.date;
                return (
                  <div
                    key={idx}
                    onClick={() => handleSelectHistory(scan)}
                    className={cn(
                      "relative p-3 border-2 cursor-pointer transition-all duration-200 group",
                      isSelected
                        ? "bg-black text-white border-black neo-shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:border-black hover:neo-shadow-sm",
                    )}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-xs uppercase truncate max-w-[140px]">
                        {scan.jobRole}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-mono font-bold px-1.5 py-0.5 border",
                          scan.score >= 80
                            ? "bg-emerald-400 text-black border-black"
                            : scan.score >= 60
                              ? "bg-amber-400 text-black border-black"
                              : "bg-rose-400 text-black border-black",
                        )}
                      >
                        {scan.score}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span
                        className={cn(
                          "text-[10px] font-mono uppercase",
                          isSelected ? "text-slate-400" : "text-slate-500",
                        )}
                      >
                        {scan.date
                          ? format(new Date(scan.date), "dd MMM")
                          : "-"}
                      </span>

                      <button
                        onClick={(e) => handleDelete(e, scan.date)}
                        className={cn(
                          "opacity-0 group-hover:opacity-100 transition-opacity p-1",
                          isSelected
                            ? "text-white hover:text-red-400"
                            : "text-slate-400 hover:text-red-600",
                        )}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 border-t-2 border-black bg-white flex-shrink-0">
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase text-center">
          Scanner v2.1
        </div>
      </div>
    </div>
  );
};

export default NavContent;
