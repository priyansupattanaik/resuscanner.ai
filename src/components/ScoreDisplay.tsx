import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  isVisible: boolean;
  missingKeywords?: string[]; // Made optional to prevent crashes if undefined
}

const ScoreDisplay = ({
  score,
  isVisible,
  missingKeywords = [],
}: ScoreDisplayProps) => {
  if (!isVisible) return null;

  // Chart Data for the Gauge
  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  // Color logic based on score
  const getColor = (value: number) => {
    if (value >= 80) return "#22c55e"; // Green
    if (value >= 60) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  const primaryColor = getColor(score);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Score Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
          <CardTitle className="text-lg font-medium text-slate-700 flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full`}
              style={{ backgroundColor: primaryColor }}
            />
            ATS Compatibility Score
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* The Gauge Chart */}
            <div className="relative h-48 w-48 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    startAngle={180}
                    endAngle={0}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={primaryColor} />
                    <Cell fill="#f1f5f9" /> {/* Slate-100 for empty part */}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Centered Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
                <span className="text-4xl font-bold text-slate-900">
                  {Math.round(score)}
                </span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  / 100
                </span>
              </div>
            </div>

            {/* Score Interpretation */}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  {score >= 80
                    ? "Excellent Match"
                    : score >= 60
                    ? "Good Potential"
                    : "Needs Improvement"}
                </h3>
                <p className="text-slate-500 mt-1">
                  {score >= 80
                    ? "Your resume is highly optimized for this role."
                    : "You are missing some critical keywords found in the job description."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Missing Keywords Analysis */}
      {missingKeywords.length > 0 && (
        <Card className="border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-lg font-medium text-slate-700 flex items-center justify-between">
              <span>Missing Keywords</span>
              <Badge
                variant="secondary"
                className="bg-slate-100 text-slate-600"
              >
                {missingKeywords.length} Found
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-slate-500 mb-4">
              Adding these keywords to your resume (contextually) may improve
              your ATS ranking.
            </p>
            <div className="flex flex-wrap gap-2">
              {missingKeywords.map((keyword, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="px-3 py-1.5 text-sm border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors flex items-center gap-1.5"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  {keyword}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ScoreDisplay;
