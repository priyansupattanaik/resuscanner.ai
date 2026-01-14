import React from "react";
import { useScan } from "@/context/ScanContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  PlusCircle,
  History,
  ChevronRight,
  LayoutDashboard,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Props to allow the parent to close the mobile sheet when an item is clicked
interface NavContentProps {
  onNavigate?: () => void;
}

const NavContent = ({ onNavigate }: NavContentProps) => {
  const { history, loadScanFromHistory, deleteScan, resetScan, result } =
    useScan();

  const handleDelete = (e: React.MouseEvent, date: string) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this scan?")) {
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
    <div className="flex flex-col h-full bg-slate-50/50">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">
            ResuScanner
          </span>
        </div>

        <Button
          onClick={handleNewScan}
          className="w-full justify-start gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 shadow-sm"
          variant="outline"
        >
          <PlusCircle className="w-4 h-4" />
          New Scan
        </Button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="px-6 py-4 flex-shrink-0">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <History className="w-3 h-3" />
            Recent Scans
          </h3>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-6">
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">
                No history yet
              </p>
            ) : (
              history.map((scan, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectHistory(scan)}
                  className={cn(
                    "relative p-3 rounded-lg cursor-pointer transition-all border group pr-9",
                    result?.date === scan.date
                      ? "bg-indigo-50 border-indigo-200 shadow-sm"
                      : "bg-white border-transparent hover:border-slate-200 hover:shadow-sm"
                  )}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={cn(
                        "font-medium text-sm truncate max-w-[140px]",
                        result?.date === scan.date
                          ? "text-indigo-700"
                          : "text-slate-700"
                      )}
                    >
                      {scan.jobRole}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-bold px-1.5 py-0.5 rounded",
                        scan.score >= 80
                          ? "bg-emerald-100 text-emerald-700"
                          : scan.score >= 60
                          ? "bg-amber-100 text-amber-700"
                          : "bg-rose-100 text-rose-700"
                      )}
                    >
                      {scan.score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">
                      {scan.date ? format(new Date(scan.date), "MMM d") : "N/A"}
                    </span>
                    {result?.date === scan.date && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    )}
                  </div>

                  {/* Delete Button */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => handleDelete(e, scan.date)}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete scan</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 flex-shrink-0">
        <div className="text-[10px] text-slate-400 text-center">
          v1.1.2 • Mobile Ready
        </div>
      </div>
    </div>
  );
};

export default NavContent;
