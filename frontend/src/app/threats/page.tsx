"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Sidebar from "@/components/dashboard/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  ShieldCheck,
  ShieldAlert,
  Globe,
  Skull,
  Activity,
  Search,
} from "lucide-react";

export default function ThreatsPage() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchThreats = async () => {
      if (!domain) return;
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/reputation-scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        });
        const result = await res.json();
        setData(result.data);
      } catch (err) {
        console.error("Threat fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchThreats();
  }, [domain]);

  return (
    <div className="flex h-screen bg-[#050505] text-white overflow-hidden">
      <Sidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto relative custom-scrollbar">
        {/* Ambient Threat Glow */}
        <div
          className={`fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 ${data?.level === "good" ? "bg-emerald-500/5" : "bg-red-500/10"}`}
        />

        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex justify-between items-end border-b border-zinc-800 pb-6">
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase">
                Threat Intel
              </h1>
              <p className="text-zinc-500 text-sm mt-2 font-mono italic">
                {domain
                  ? `Analyzing Target: ${domain}`
                  : "No active target selected"}
              </p>
            </div>
            {data && (
              <div className="flex gap-4">
                <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-center">
                  <p className="text-[10px] text-zinc-500 uppercase font-bold">
                    Reputation Score
                  </p>
                  <p
                    className={`text-xl font-black ${data.score > 70 ? "text-emerald-400" : "text-red-500"}`}
                  >
                    {data.score}/100
                  </p>
                </div>
              </div>
            )}
          </div>

          {loading ? (
            <div className="h-[60vh] flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
              <p className="text-[10px] font-mono text-red-500 animate-pulse tracking-[0.4em]">
                SCRAPING_GLOBAL_BLACKLISTS...
              </p>
            </div>
          ) : data ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in-95 duration-500">
              {/* Left Column: Issues & Summary */}
              <div className="lg:col-span-2 space-y-6">
                <Card
                  className={`border-none ${data.level === "good" ? "bg-emerald-500/10" : "bg-red-500/10"}`}
                >
                  <CardContent className="p-6 flex items-center gap-6">
                    <div
                      className={`p-4 rounded-full border-2 ${data.level === "good" ? "border-emerald-500/50 bg-emerald-500/20" : "border-red-500/50 bg-red-500/20"}`}
                    >
                      {data.level === "good" ? (
                        <ShieldCheck className="w-10 h-10 text-emerald-400" />
                      ) : (
                        <Skull className="w-10 h-10 text-red-400" />
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black uppercase tracking-tight">
                        {data.level === "good"
                          ? "Low Risk Infrastructure"
                          : "High Risk Detected"}
                      </h2>
                      <p className="text-sm text-zinc-400 mt-1 max-w-md">
                        The domain reputation is based on current SPF/DMARC
                        alignment, TLS validity, and global engine hits.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-[#0A0A0B] border-zinc-800">
                    <CardContent className="p-6">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">
                        Analysis Vectors
                      </h3>
                      <div className="space-y-4">
                        {data.issues.map((issue: string, i: number) => (
                          <div key={i} className="flex gap-3 group">
                            <Activity className="w-4 h-4 text-cyan-500 flex-shrink-0" />
                            <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                              {issue}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-[#0A0A0B] border-zinc-800">
                    <CardContent className="p-6">
                      <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 border-b border-zinc-800 pb-2">
                        Technical Summary
                      </h3>
                      <div className="p-4 bg-black/40 rounded border border-zinc-800 font-mono text-[11px] leading-relaxed text-zinc-400">
                        &gt; Target: {domain}
                        <br />
                        &gt; Classification: {data.level.toUpperCase()}
                        <br />
                        &gt; Status: Synchronized
                        <br />
                        &gt; Scan_Complete: True
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Right Column: Blacklist Engine Hits */}
              <div className="space-y-6">
                <Card className="bg-[#0A0A0B] border-zinc-800 h-full">
                  <CardContent className="p-6">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6">
                      Security Engine Hits
                    </h3>
                    <div className="space-y-3">
                      {data.blacklistHits.length > 0 ? (
                        data.blacklistHits.map((hit: any, i: number) => (
                          <div
                            key={i}
                            className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg flex items-center justify-between group hover:bg-red-500/10 transition-all"
                          >
                            <span className="text-xs font-bold text-red-200">
                              {hit.engine}
                            </span>
                            <span className="text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded">
                              THREAT
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-30">
                          <ShieldCheck className="w-12 h-12 text-emerald-500 mb-4" />
                          <p className="text-[10px] uppercase font-mono tracking-widest">
                            Global Green-List
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="h-[50vh] flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-3xl opacity-30">
              <Search className="w-12 h-12 mb-4" />
              <p className="text-sm font-mono uppercase tracking-[0.3em]">
                No Scan Data Available
              </p>
              <p className="text-[10px] mt-2 italic text-zinc-500">
                Perform a scan from the main dashboard to view threats.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
