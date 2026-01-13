import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ScanResult } from "@/lib/atsScanner";
import { Calendar, Briefcase, ChevronRight } from "lucide-react";
import { format } from "date-fns";

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
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader className="mb-6">
          <SheetTitle>Scan History</SheetTitle>
          <SheetDescription>
            View your previous resume analyses and track your improvements.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] pr-4">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 py-8">
              No scans recorded yet.
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
                  className="group flex flex-col gap-3 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                        {scan.jobRole}
                        <Badge
                          variant="outline"
                          className="text-xs font-normal"
                        >
                          {scan.jobLevel}
                        </Badge>
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        {scan.date
                          ? format(new Date(scan.date), "PPP p")
                          : "Unknown Date"}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-xl font-bold ${
                          scan.score >= 80
                            ? "text-green-600"
                            : scan.score >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {scan.score}
                      </span>
                      <span className="text-[10px] text-slate-400 uppercase">
                        Score
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      {scan.missingKeywords.length} missing keywords
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default HistorySheet;
