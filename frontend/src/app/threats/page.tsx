"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ThreatsPage() {
  const [domain, setDomain] = useState("");

  return (
    <div className="flex h-screen bg-[#020617] text-white">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Threat Analysis</h1>

        {/* Input */}
        <div className="flex gap-4">
          <Input
            placeholder="Enter domain"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <Button onClick={() => alert(domain)}>Analyze</Button>
        </div>

        {/* Results */}
        <div className="bg-zinc-900 p-6 rounded-xl">
          <p>Threat results will appear here...</p>
        </div>
      </main>
    </div>
  );
}
