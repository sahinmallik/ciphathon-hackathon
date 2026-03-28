"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Terminal, ShieldAlert, Loader2, Info } from "lucide-react";

interface AiPanelProps {
  domain: string;
  tls: any;
  email: any;
  onStartDeepScan: () => void;
  scanning: boolean;
}

export default function AiPanel({
  domain,
  tls,
  email,
  onStartDeepScan,
  scanning,
}: AiPanelProps) {
  return (
    <Card className="bg-[#0A0A0B] border border-zinc-800 flex flex-col h-full shadow-2xl">
      <CardContent className="p-6 flex flex-col h-full space-y-6">
        <div className="flex items-center gap-2 border-b border-zinc-800 pb-4">
          <Bot className="w-4 h-4 text-cyan-400" />
          <h3 className="text-zinc-100 text-xs font-black uppercase tracking-[0.2em]">
            AI Security Officer
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800/50 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert className="w-3 h-3 text-cyan-500" />
              <p className="text-cyan-500 text-[10px] font-bold uppercase tracking-widest">
                Metadata Analysis
              </p>
            </div>
            <div className="font-mono text-[12px] text-zinc-400 space-y-1">
              <p>
                <span className="text-zinc-600">&gt;</span> ISSUER:{" "}
                {tls?.issuer || "N/A"}
              </p>
              <p>
                <span className="text-zinc-600">&gt;</span> PROTOCOL:{" "}
                {tls?.protocol || "N/A"}
              </p>
            </div>
          </div>

          {email?.dkim?.note && (
            <div className="p-3 bg-blue-500/5 rounded-lg border border-blue-500/20 text-[12px] text-blue-300 font-medium flex gap-2">
              <Info className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{email.dkim.note}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-zinc-800 space-y-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-3 h-3 text-zinc-500" />
            <p className="text-[10px] text-zinc-300 font-bold uppercase tracking-widest">
              Discovery Hub
            </p>
          </div>

          <Button
            onClick={onStartDeepScan} // THIS CALLS THE FUNCTION IN PAGE.TSX
            disabled={scanning || !domain}
            className={`w-full text-[11px] font-black tracking-[0.2em] h-10 transition-all ${
              scanning
                ? "bg-zinc-800 text-zinc-500"
                : "bg-zinc-100 text-black hover:bg-cyan-500 hover:text-black"
            }`}
          >
            {scanning ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" />
                ENUMERATING...
              </div>
            ) : (
              "PERFORM DEEP SCAN"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
