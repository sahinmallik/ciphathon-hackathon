"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { ShieldAlert, ArrowLeft, Globe, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

import Sidebar from "@/components/dashboard/sidebar";
import ScoreCard from "@/components/dashboard/score-card";
import ThreatCards from "@/components/dashboard/threat-cards";
import FindingsTable from "@/components/dashboard/findings-table";
import AiPanel from "@/components/dashboard/ai-panel";
import SubdomainCard from "@/components/dashboard/subdomain-card";
import AiChatSheet from "@/components/dashboard/ai-chat-sheet";
import PortScannerCard from "@/components/dashboard/PortScannerCard";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const domain = searchParams.get("domain");
  const { user, isLoaded } = useUser();

  const [scanData, setScanData] = useState<any>(null);
  const [reputation, setReputation] = useState<any>(null);
  const [subdomainData, setSubdomainData] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [subdomainLoading, setSubdomainLoading] = useState(false);

  // ✅ NEW STATES
  const [portData, setPortData] = useState<any>(null);
  const [portLoading, setPortLoading] = useState(false);

  const [accessError, setAccessError] = useState<{
    message: string;
    code: string;
  } | null>(null);

  useEffect(() => {
    const runInitialScans = async () => {
      if (!domain || !user) {
        if (isLoaded && !user) setLoading(false);
        return;
      }

      try {
        const results = await Promise.allSettled([
          fetch("http://localhost:8080/health", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ domain, clerkId: user.id }),
          }).then((res) => res.json()),

          fetch("http://localhost:8080/email/check", {
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

        const tlsRes =
          results[0].status === "fulfilled" ? results[0].value : null;
        const emailRes =
          results[1].status === "fulfilled" ? results[1].value : null;
        const repoRes =
          results[2].status === "fulfilled" ? results[2].value : null;

        if (
          tlsRes?.message === "Domain is not verified" ||
          tlsRes?.message === "Domain not found"
        ) {
          setAccessError({
            message: "Domain verification required.",
            code: "403_UNVERIFIED",
          });
          return;
        }

        if (
          tlsRes?.message === "You are not authorized!!!" ||
          emailRes?.message === "you are not authorized!!!"
        ) {
          setAccessError({
            message: "Unauthorized access attempt detected.",
            code: "401_UNAUTHORIZED",
          });
          return;
        }

        const tlsData = tlsRes;
        const emailData = emailRes?.data;

        const tlsScore = tlsData?.valid === "Valid" ? 25 : 0;
        const emailScore = emailData?.spf?.exists ? 24 : 0;
        const totalScore = tlsScore + emailScore;

        setScanData({
          tls: { data: tlsData },
          email: emailData,
          score: {
            total: totalScore,
            level: totalScore >= 40 ? "Secure" : "At Risk",
            breakdown: { tls: tlsScore, email: emailScore },
          },
        });

        setReputation(repoRes?.data);
      } catch (error) {
        console.error("Dashboard Sync Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) runInitialScans();
  }, [domain, user, isLoaded]);

  // DEEP SCAN
  const handleDeepDiscovery = async () => {
    if (!domain || !user) return;

    setSubdomainLoading(true);

    try {
      const res = await fetch("http://localhost:8080/subdomain-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, clerkId: user.id }),
      });

      const result = await res.json();
      setSubdomainData(result.data);
    } catch (error) {
      console.error("Deep Scan Error:", error);
    } finally {
      setSubdomainLoading(false);
    }
  };

  // ✅ PORT SCAN HANDLER
  const handlePortScan = async () => {
    if (!domain) return;

    setPortLoading(true);
    try {
      const res = await fetch("http://localhost:8080/port-scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain }),
      });

      const result = await res.json();
      setPortData(result);
    } catch (err) {
      console.error("Port Scan Error:", err);
    } finally {
      setPortLoading(false);
    }
  };

  if (accessError) {
    return (
      <div className="h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 italic">
          Access Denied
        </h2>
        <p className="text-zinc-500 font-mono text-sm mb-8">
          {accessError.message}
        </p>
        <Button onClick={() => router.push("/dashboard/assets")}>
          Return to Assets
        </Button>
      </div>
    );
  }

  if (loading)
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center font-mono">
        <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
        <div className="text-cyan-400 animate-pulse tracking-[0.2em] text-xs uppercase italic">
          &gt; KYRONYX_OS: VALIDATING_CLEARANCE...
        </div>
      </div>
    );

  const isSecure = scanData?.score?.level === "Secure";

  return (
    <div className="flex h-screen bg-[#050505] text-zinc-100 overflow-hidden">
      <main className="flex-1 overflow-y-auto relative custom-scrollbar">
        <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-[1400px] mx-auto p-8 space-y-8 pb-24">
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-8">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tighter text-white uppercase italic">
                Security Command
              </h1>
              <p className="text-zinc-400 text-sm mt-2 font-mono">
                TUNNEL:{" "}
                <span className="text-cyan-400 font-bold underline underline-offset-8 decoration-cyan-500/20">
                  {domain}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4">
              <AiChatSheet
                domain={domain}
                contextData={{ scanData, reputation }}
              />

              {/* ✅ PORT SCAN BUTTON */}
              <Button
                onClick={handlePortScan}
                disabled={portLoading}
                className="
    relative px-5 py-2 rounded-lg
    bg-[#0b0f12]/80 
    border border-cyan-500/20
    text-cyan-300
    font-mono text-[11px] tracking-[0.18em] uppercase
    backdrop-blur-md

    transition-all duration-300

    hover:bg-cyan-500/10
    hover:border-cyan-400/40
    hover:text-cyan-200

    active:scale-[0.97]

    disabled:opacity-40 disabled:cursor-not-allowed
  "
              >
                <span className="flex items-center gap-2">
                  {/* status dot */}
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      portLoading
                        ? "bg-cyan-400 animate-pulse"
                        : "bg-cyan-500/60"
                    }`}
                  />

                  {portLoading ? "SCANNING" : "SCAN PORTS"}
                </span>

                {/* subtle glow */}
                <span className="absolute inset-0 rounded-lg bg-cyan-500/5 opacity-0 hover:opacity-100 transition duration-300 pointer-events-none" />
              </Button>

              <div
                className={`px-5 py-2 rounded-lg border font-mono text-[11px] font-black tracking-widest flex items-center gap-3 ${
                  isSecure
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSecure
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-red-500 animate-ping"
                  }`}
                />
                STATUS: {isSecure ? "SECURE" : "UNSECURE"}
              </div>
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

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FindingsTable
                tls={scanData?.tls?.data}
                email={scanData?.email}
              />
            </div>
            <div className="lg:col-span-1">
              <AiPanel
                domain={domain || ""}
                tls={scanData?.tls?.data}
                email={scanData?.email}
                onStartDeepScan={handleDeepDiscovery}
                scanning={subdomainLoading}
              />
            </div>
          </div>

          {/* SUBDOMAIN */}
          <div className="w-full">
            <SubdomainCard data={subdomainData} loading={subdomainLoading} />
          </div>

          {/* ✅ PORT SCANNER CARD */}
          <div className="w-full">
            <PortScannerCard data={portData} loading={portLoading} />
          </div>
        </div>
      </main>
    </div>
  );
}
