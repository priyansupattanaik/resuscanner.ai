import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Wand2, Copy, RefreshCw, AlertCircle, ArrowLeft } from "lucide-react";
import { humanizeText } from "@/lib/humanizer";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const RATE_LIMIT_COOLDOWN = 10000; // 10 seconds ms

const Humanizer = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [tone, setTone] = useState<
    "formal" | "informal" | "interview" | "explanatory"
  >("informal");
  const [loading, setLoading] = useState(false);
  const [lastRun, setLastRun] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  // Rate Limit Timer
  useEffect(() => {
    if (lastRun === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = now - lastRun;
      if (diff < RATE_LIMIT_COOLDOWN) {
        setTimeLeft(Math.ceil((RATE_LIMIT_COOLDOWN - diff) / 1000));
      } else {
        setTimeLeft(0);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastRun]);

  const handleHumanize = async () => {
    if (!input.trim()) {
      toast.error("Please enter some text first.");
      return;
    }

    if (input.length > 3000) {
      toast.error("Text is too long. Please keep it under 3000 characters.");
      return;
    }

    if (timeLeft > 0) {
      toast.error(`Please wait ${timeLeft}s before running again.`);
      return;
    }

    setLoading(true);
    try {
      const result = await humanizeText({ text: input, tone });
      setOutput(result);
      setLastRun(Date.now());
      toast.success("Text humanized successfully!");
    } catch (error) {
      toast.error("Failed to process text. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  };

  return (
    <Layout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col gap-2">
          {/* Back Navigation */}
          <Link to="/" className="inline-flex w-fit">
            <Button
              variant="ghost"
              className="pl-0 hover:bg-transparent hover:text-primary -ml-2 mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <h1 className="text-3xl font-bold tracking-tight">AI Humanizer</h1>
          <p className="text-slate-500">
            Transform robotic AI text into undetectable, human-sounding
            narrative using the Alex Rivera engine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-250px)] min-h-[500px]">
          {/* Input Section */}
          <Card className="p-4 flex flex-col gap-4 neo-shadow border-2 border-black">
            <div className="flex items-center justify-between">
              <Label className="font-bold uppercase text-xs tracking-wider text-slate-500">
                Input Text (AI Generated)
              </Label>
              <span
                className={`text-xs font-mono ${input.length > 3000 ? "text-red-500" : "text-slate-400"}`}
              >
                {input.length}/3000
              </span>
            </div>

            <Textarea
              placeholder="Paste your ChatGPT/Claude text here..."
              className="flex-1 resize-none border-2 focus-visible:ring-0 focus-visible:border-black font-mono text-sm"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="flex gap-3 items-end">
              <div className="flex-1 space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={(v: any) => setTone(v)}>
                  <SelectTrigger className="border-2 border-black">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="informal">Informal (Raw)</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="interview">Interview Style</SelectItem>
                    <SelectItem value="explanatory">Explanatory</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleHumanize}
                disabled={loading || timeLeft > 0 || !input.trim()}
                className="h-10 px-6 border-2 border-black neo-shadow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all bg-primary text-white"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="w-4 h-4 mr-2" />
                )}
                {timeLeft > 0 ? `Wait ${timeLeft}s` : "Humanize"}
              </Button>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="p-4 flex flex-col gap-4 neo-shadow border-2 border-black bg-slate-50">
            <div className="flex items-center justify-between">
              <Label className="font-bold uppercase text-xs tracking-wider text-slate-500">
                Humanized Output
              </Label>
              {output && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-6 hover:bg-slate-200"
                >
                  <Copy className="w-3 h-3 mr-1" /> Copy
                </Button>
              )}
            </div>

            {output ? (
              <div className="flex-1 p-3 bg-white border border-slate-200 rounded-md overflow-y-auto font-serif leading-relaxed whitespace-pre-wrap text-slate-800">
                {output}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300 border-2 border-dashed border-slate-200 rounded-md">
                <Wand2 className="w-12 h-12 mb-2 opacity-20" />
                <p className="text-sm font-medium">Ready to process</p>
              </div>
            )}

            <div className="flex items-start gap-2 text-[10px] text-slate-400 p-2 bg-yellow-50/50 border border-yellow-100 rounded">
              <AlertCircle className="w-3 h-3 text-yellow-500 mt-0.5" />
              <p>
                Output generated by Humanize Engine. Results vary based on
                input complexity.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Humanizer;
