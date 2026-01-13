import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { sendChatMessage, ChatMessage } from "@/lib/chat";

interface ChatAssistantProps {
  resumeText: string;
  jobRole: string;
}

const ChatAssistant = ({ resumeText, jobRole }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hello! I'm your AI Coach. I've analyzed your resume for the ${jobRole} position. Ask me how to improve specific sections!`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
          content: "I'm having trouble connecting right now.",
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
    <div className="glass-card flex flex-col h-[600px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/20 bg-white/40 backdrop-blur-md flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">AI Career Coach</h3>
          <p className="text-xs text-slate-500">Online • Powered by Molmo</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6 bg-slate-50/30">
        <div className="space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm mt-1">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}

              <div
                className={`
                  max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm
                  ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border border-white/40 text-slate-700 rounded-tl-none"
                  }
                `}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm mt-1">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-white border border-white/40 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 bg-white/60 backdrop-blur-md border-t border-white/20">
        <div className="relative flex items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your resume..."
            className="rounded-full pl-5 pr-12 h-12 bg-white border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
