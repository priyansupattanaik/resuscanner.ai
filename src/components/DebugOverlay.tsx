import React, { useEffect, useState } from "react";
import { debugService, LogEntry } from "@/lib/debug";
import {
  X,
  Trash2,
  Terminal,
  ChevronDown,
  ChevronRight,
  Activity,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const DebugOverlay = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubLogs = debugService.subscribe(setLogs);
    const unsubOpen = debugService.subscribeOpen(setIsOpen);
    return () => {
      unsubLogs();
      unsubOpen();
    };
  }, []);

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedLogs);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedLogs(newSet);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => debugService.toggle()}
        className="fixed bottom-4 right-4 z-50 p-3 bg-black/80 text-white rounded-full shadow-lg hover:scale-110 transition-transform backdrop-blur-md border border-white/10"
        title="Open Developer Tools"
      >
        <Terminal className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 w-[400px] z-50 bg-black/90 backdrop-blur-xl border-l border-white/10 text-slate-300 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col font-mono text-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Activity className="w-4 h-4 text-blue-400" />
          <span>System Diagnostics</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => debugService.clear()}
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => debugService.toggle()}
            className="h-8 w-8 text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Logs Area */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {logs.length === 0 && (
            <div className="text-center text-slate-600 py-10">
              <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>System Ready. Waiting for events...</p>
            </div>
          )}

          {logs.map((log) => (
            <div
              key={log.id}
              className={cn(
                "rounded-lg border bg-white/5 overflow-hidden transition-colors",
                log.type === "error"
                  ? "border-red-500/50 bg-red-500/10"
                  : log.type === "success"
                  ? "border-green-500/50 bg-green-500/10"
                  : "border-white/10 hover:border-white/20"
              )}
            >
              <div
                className="p-3 flex gap-3 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => toggleExpand(log.id)}
              >
                <div className="mt-0.5 shrink-0">
                  {log.type === "error" ? (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  ) : log.type === "success" ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <ChevronRight
                      className={cn(
                        "w-4 h-4 transition-transform",
                        expandedLogs.has(log.id) && "rotate-90"
                      )}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <span
                      className={cn(
                        "font-semibold truncate",
                        log.type === "error"
                          ? "text-red-400"
                          : log.type === "success"
                          ? "text-green-400"
                          : "text-white"
                      )}
                    >
                      {log.message}
                    </span>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  {log.data && (
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <span>JSON Payload Available</span>
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  )}
                </div>
              </div>

              {/* Expandable JSON Data */}
              {expandedLogs.has(log.id) && log.data && (
                <div className="p-3 border-t border-white/10 bg-black/30 overflow-x-auto">
                  <pre className="text-[10px] text-blue-300 font-mono leading-relaxed">
                    {JSON.stringify(log.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DebugOverlay;
