import React from "react";
import { ScanResult } from "@/lib/atsScanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

interface ScoreDisplayProps {
  result: ScanResult;
}

const ScoreDisplay = ({ result }: ScoreDisplayProps) => {
  const { score, missingKeywords, summary, jobRole } = result;

  const data = [
    {
      name: "Score",
      value: score,
      fill: score >= 80 ? "#10b981" : score >= 60 ? "#f59e0b" : "#f43f5e",
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Summary: Flex-Col on Mobile, Row on Desktop */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Score Card */}
        <Card className="w-full lg:w-80 shadow-sm border-slate-200 overflow-hidden relative flex-shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
          <CardContent className="pt-8 flex flex-col items-center justify-center">
            {/* Responsive Chart Container */}
            <div className="h-48 w-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  innerRadius="80%"
                  outerRadius="100%"
                  barSize={10}
                  data={data}
                  startAngle={90}
                  endAngle={-270}
                >
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar background dataKey="value" cornerRadius={30} />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-bold tracking-tighter text-slate-900">
                  {score}
                </span>
                <span className="text-xs uppercase font-bold text-slate-400 mt-1">
                  ATS Score
                </span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <h3 className="font-semibold text-slate-900">
                {score >= 80
                  ? "Match Found"
                  : score >= 60
                  ? "Potential Match"
                  : "Low Match"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                vs. {jobRole} requirements
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Executive Summary */}
        <Card className="flex-1 shadow-sm border-slate-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2 text-slate-800">
              <Sparkles className="w-4 h-4 text-purple-500" />
              AI Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 leading-relaxed text-sm">
              {summary}
            </div>

            {/* Stats Grid: 1 col on mobile, 3 cols on tablet/desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-full shrink-0">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">
                    Format
                  </p>
                  <p className="text-sm font-semibold">Standard</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-full shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">
                    Parsing
                  </p>
                  <p className="text-sm font-semibold">Success</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-white">
                <div className="p-2 bg-rose-100 text-rose-600 rounded-full shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">
                    Keywords
                  </p>
                  <p className="text-sm font-semibold">
                    {missingKeywords.length} Missing
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keyword Analysis */}
      <Card className="shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base text-slate-800">
            Critical Missing Keywords
          </CardTitle>
        </CardHeader>
        <CardContent>
          {missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border-rose-100 gap-1.5 text-sm"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  {keyword}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 p-4 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">
                Great job! No critical keywords missing.
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreDisplay;
