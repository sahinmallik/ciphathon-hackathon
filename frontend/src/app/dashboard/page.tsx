"use client";

import { useSearchParams } from "next/navigation";

import Sidebar from "@/components/dashboard/sidebar";
import Topbar from "@/components/dashboard/topbar";
import ScoreCard from "@/components/dashboard/score-card";
import ThreatCards from "@/components/dashboard/threat-cards";
import FindingsTable from "@/components/dashboard/findings-table";
import AiPanel from "@/components/dashboard/ai-panel";
import Alerts from "@/components/dashboard/alerts";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const domain = searchParams.get("domain");

  return (
    <div className="flex h-screen bg-[#0B0F19] text-white">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6 overflow-y-auto">
        <Topbar />

        {/* Show selected domain */}
        <h2 className="text-sm text-zinc-400">
          Scanning domain: <span className="text-cyan-400">{domain}</span>
        </h2>

        <ScoreCard />
        <ThreatCards />
        <Alerts />

        <div className="grid grid-cols-3 gap-6">
          <FindingsTable />
          <AiPanel />
        </div>
      </main>
    </div>
  );
}
