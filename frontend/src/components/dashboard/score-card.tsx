import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, Activity } from "lucide-react";

export default function ScoreCard({ score, breakdown }: any) {
  // Score is out of 50. Let's calculate the percentage for the glow/color.
  const percentage = (score / 50) * 100;

  const getStatusColor = (s: number) => {
    if (s >= 40)
      return "text-[#00FF9F] drop-shadow-[0_0_10px_rgba(0,255,159,0.3)]"; // Cyber Lime
    if (s >= 25)
      return "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.2)]";
    return "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.3)]";
  };

  return (
    <Card className="bg-[#0A0A0B] border border-zinc-800 relative overflow-hidden">
      {/* Visual Scanline Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-[200%] animate-[scan_4s_linear_infinite] pointer-events-none" />

      <CardContent className="p-8 flex justify-between items-center relative z-10">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-100">
                Network Integrity Index
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <Activity className="w-3 h-3 text-emerald-500 animate-pulse" />
                <p className="text-zinc-100 text-xs font-mono uppercase tracking-tighter">
                  System: Optimal
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-10">
            {/* TLS Breakdown (Out of 25) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center w-36">
                <span className="text-[9px] font-mono text-zinc-200 uppercase tracking-widest">
                  TLS_SECURITY
                </span>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">
                  {breakdown?.tls || 0}/25
                </span>
              </div>
              <div className="w-36 h-1.5 bg-zinc-900 rounded-none overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all duration-1000"
                  style={{ width: `${((breakdown?.tls || 0) / 25) * 100}%` }}
                />
              </div>
            </div>

            {/* Email Breakdown (Out of 25) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center w-36">
                <span className="text-[9px] font-mono text-zinc-200 uppercase tracking-widest">
                  EMAIL_LAYER
                </span>
                <span className="text-[10px] font-mono text-purple-400 font-bold">
                  {breakdown?.email || 0}/25
                </span>
              </div>
              <div className="w-36 h-1.5 bg-zinc-900 rounded-none overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-1000"
                  style={{ width: `${((breakdown?.email || 0) / 25) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Global Score Display */}
        <div className="flex flex-col items-end">
          <div className="relative group">
            <span
              className={`text-9xl font-black tracking-tighter tabular-nums leading-none ${getStatusColor(score)}`}
            >
              {score}
            </span>
            <span className="absolute -top-2 -right-6 text-zinc-700 font-mono text-sm">
              /50
            </span>
          </div>
          <div className="mt-4 flex flex-col items-end">
            <div className="h-1 w-24 bg-zinc-900 rounded-full overflow-hidden mb-1">
              <div
                className="h-full bg-emerald-500 transition-all duration-700"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[9px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
              Overall Rating
            </p>
          </div>
        </div>
      </CardContent>

      {/* Aesthetic Frame Corner */}
      <div className="absolute top-0 right-0 p-1">
        <div className="w-4 h-4 border-t-2 border-r-2 border-zinc-800" />
      </div>
    </Card>
  );
}
