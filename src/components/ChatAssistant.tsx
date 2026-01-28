import React, { useState, useRef, useEffect } from "react";
import { ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatMessage, ChatMessage } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { ScanResult } from "@/lib/atsScanner"; // Import ScanResult

interface ChatAssistantProps {
  scanResult: ScanResult; // UPDATED: Takes full result object
}

const ChatAssistant = ({ scanResult }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `TAS here. I've scored your resume ${scanResult.score}/100 for the ${scanResult.jobRole} position. ${
        scanResult.score < 40
          ? "It appears to be a mismatch."
          : "Let's optimize it."
      } What questions do you have?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset chat when scanResult changes (new scan performed)
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `TAS here. I've scored your resume ${scanResult.score}/100 for the ${scanResult.jobRole} position. ${
          scanResult.score < 40
            ? "It appears to be a mismatch."
            : "Let's optimize it."
        } What questions do you have?`,
      },
    ]);
  }, [scanResult.date]); // Depend on date to detect new scans

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Pass the full scanResult to the chat function
      const aiResponseContent = await sendChatMessage(
        [...messages, userMsg],
        scanResult,
      );
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: aiResponseContent },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "TAS System Alert: Connection failed.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full border-2 border-black bg-white neo-shadow relative overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="h-12 bg-black text-white flex items-center justify-between px-4 border-b-2 border-black z-10 shrink-0">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-bold text-sm tracking-wide uppercase">
            TAS AI Assistant
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-mono text-slate-300 uppercase">
            Live
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 bg-slate-50 w-full">
        <div className="p-4 space-y-6 flex flex-col w-full">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex flex-col w-full max-w-[90%] transition-opacity duration-500 animate-fade-in",
                msg.role === "user"
                  ? "self-end items-end"
                  : "self-start items-start",
              )}
            >
              <div className="flex items-center gap-2 mb-1 opacity-70">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                  {msg.role === "user" ? "You" : "TAS"}
                </span>
              </div>

              <div
                className={cn(
                  "px-4 py-3 border-2 text-sm leading-relaxed font-sans shadow-sm transition-all duration-200 hover:shadow-md",
                  msg.role === "user"
                    ? "bg-white text-black border-black rounded-none rounded-bl-xl border-r-4"
                    : "bg-white text-slate-800 border-slate-200 rounded-none rounded-tr-xl border-l-4",
                )}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex flex-col items-start gap-1 w-full max-w-[90%] self-start animate-pulse">
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-tr-xl">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-0 bg-white border-t-2 border-black shrink-0">
        <div className="flex gap-0 w-full h-14">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask TAS regarding your resume..."
            className="flex-1 h-full rounded-none bg-white border-none focus-visible:ring-0 px-4 font-sans text-sm placeholder:text-slate-400"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="h-full w-14 rounded-none bg-black text-white hover:bg-primary border-l-2 border-black transition-colors"
          >
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
