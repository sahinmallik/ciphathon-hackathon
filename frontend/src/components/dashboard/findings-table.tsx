import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck, Zap } from "lucide-react";

export default function FindingsTable({ tls, email }: any) {
  const findings = [];

  if (tls && tls.valid !== "Valid") {
    findings.push({
      issue: "SSL Certificate Configuration",
      severity: "CRITICAL",
      color: "text-red-500",
      border: "border-red-500/30",
      bg: "bg-red-500/10",
    });
  }

  if (email && !email.spf?.exists) {
    findings.push({
      issue: "SPF Security Protocol",
      severity: "HIGH",
      color: "text-orange-500",
      border: "border-orange-500/30",
      bg: "bg-orange-500/10",
    });
  }

  if (email && !email.dmarc?.exists) {
    findings.push({
      issue: "DMARC Enforcement",
      severity: "MEDIUM",
      color: "text-yellow-500",
      border: "border-yellow-500/30",
      bg: "bg-yellow-500/10",
    });
  }

  return (
    <Card className="col-span-2 bg-[#0A0A0B] border border-zinc-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
      <CardContent className="p-0">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/20">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-zinc-100 uppercase tracking-tight text-sm">
              Vulnerability Report
            </h3>
          </div>
          <span className="text-[10px] font-bold text-zinc-200 bg-zinc-800 px-3 py-1 rounded-full border border-zinc-700">
            {findings.length} VECTOR(S) FLAGGED
          </span>
        </div>

        <div className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white bg-zinc-900/40">
                <th className="px-6 py-4">Security Vector</th>
                <th className="px-6 py-4">Threat Level</th>
                <th className="px-6 py-4 text-right">Operation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {findings.length > 0 ? (
                findings.map((f, i) => (
                  <tr
                    key={i}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-5">
                      <span className="text-zinc-200 font-bold">{f.issue}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-2 py-1 rounded text-[10px] font-black border ${f.bg} ${f.color} ${f.border}`}
                      >
                        {f.severity}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Button className="h-8 bg-zinc-100 text-black hover:bg-cyan-400 hover:text-black font-black text-[10px] tracking-widest px-4">
                        FIX <Zap className="w-3 h-3 ml-2 fill-current" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <ShieldCheck className="w-12 h-12 text-green-500 opacity-50" />
                      <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                        [ NO VULNERABILITIES DETECTED ]
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
