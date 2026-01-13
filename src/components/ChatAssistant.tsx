import React, { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatMessage, ChatMessage } from "@/lib/chat";
import { cn } from "@/lib/utils";

interface ChatAssistantProps {
  resumeText: string;
  jobRole: string;
}

const ChatAssistant = ({ resumeText, jobRole }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hello! I've analyzed your resume for the ${jobRole} position. I can help you rewrite bullet points or suggest improvements. What would you like to focus on?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      const aiResponseContent = await sendChatMessage(
        [...messages, userMsg],
        resumeText,
        jobRole
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
          content: "I'm having trouble connecting right now. Please try again.",
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
    <div className="glass-card flex flex-col h-[600px] overflow-hidden relative">
      {/* Header - Transparent Blur */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-white/20 z-10 flex items-center px-6 gap-3">
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900 text-sm">
            AI Career Coach
          </h3>
          <p className="text-[11px] text-slate-500 font-medium">
            Always Online
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-6 pt-20 pb-4 bg-slate-50/50">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={cn(
                "flex gap-3 animate-slide-up",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              {msg.role === "assistant" && (
                <div className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Sparkles className="w-3 h-3 text-purple-500" />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[85%] px-5 py-3 text-[14px] leading-relaxed shadow-sm",
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-[20px] rounded-br-sm"
                    : "bg-white border border-slate-100 text-slate-700 rounded-[20px] rounded-tl-sm"
                )}
              >
                {msg.content}
              </div>

              {msg.role === "user" && (
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-3 h-3 text-slate-500" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start animate-fade-in">
              <div className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm mt-1">
                <Sparkles className="w-3 h-3 text-purple-500" />
              </div>
              <div className="bg-white border border-slate-100 rounded-[20px] rounded-tl-sm px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} className="h-4" />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-100">
        <div className="max-w-3xl mx-auto relative flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me to rewrite a section..."
            className="rounded-full pl-5 pr-12 h-12 bg-white border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 shadow-sm transition-all"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
