"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import Sidebar from "@/components/dashboard/sidebar";
import ScoreCard from "@/components/dashboard/score-card";
import ThreatCards from "@/components/dashboard/threat-cards";
import FindingsTable from "@/components/dashboard/findings-table";
import AiPanel from "@/components/dashboard/ai-panel";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");
  const { user, isLoaded } = useUser();

  const [scanData, setScanData] = useState<any>(null);
  const [reputation, setReputation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runInitialScans = async () => {
      if (!domain || !user) {
        if (isLoaded && !user) setLoading(false);
        return;
      }

      try {
        const results = await Promise.allSettled([
          fetch("http://localhost:8080/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain, clerkId: user.id }),
          }).then((res) => res.json()),
          fetch("http://localhost:8080/reputation-scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain }),
          }).then((res) => res.json()),
        ]);

        if (results[0].status === "fulfilled") setScanData(results[0].value);
        if (results[1].status === "fulfilled")
          setReputation(results[1].value.data);
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) runInitialScans();
  }, [domain, user, isLoaded]);

  if (loading)
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center font-mono">
        <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <div className="text-cyan-400 animate-pulse tracking-[0.2em] text-xs">
          &gt; KYRONYX_OS: SYNCHRONIZING_CORES...
        </div>
      </div>
    );

  const isSecure = scanData?.score?.level === "Secure";

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden">
      {/* <Sidebar /> */}
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto p-8 space-y-8">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tighter text-white uppercase">
                Security Command
              </h1>
              <p className="text-zinc-100 text-sm mt-2 font-mono">
                TARGET:{" "}
                <span className="text-cyan-400 font-bold underline underline-offset-4 decoration-cyan-500/20">
                  {domain}
                </span>
              </p>
            </div>

            <div
              className={`px-4 py-2 rounded-lg border font-mono text-[11px] font-bold tracking-widest flex items-center gap-2 transition-all duration-500 ${
                isSecure
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-red-500/10 border-red-500/30 text-red-400"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${isSecure ? "bg-emerald-500 animate-pulse" : "bg-red-500 animate-ping"}`}
              />
              STATUS: {isSecure ? "SECURE" : "UNSECURE"}
            </div>
          </div>

          <ScoreCard
            score={scanData?.score?.total || 0}
            breakdown={scanData?.score?.breakdown}
          />
          <ThreatCards
            tls={scanData?.tls?.data}
            email={scanData?.email}
            reputation={reputation}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <FindingsTable tls={scanData?.tls?.data} email={scanData?.email} />
            <AiPanel
              domain={domain}
              tls={scanData?.tls?.data}
              email={scanData?.email}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
