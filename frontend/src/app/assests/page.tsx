"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AssetsPage() {
  const [domain, setDomain] = useState("");

  return (
    <div className="flex h-screen bg-[#020617] text-white">
      <Sidebar />

      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">Asset Discovery</h1>

        {/* Input Section */}
        <div className="flex gap-4">
          <Input
            placeholder="Enter domain (e.g., google.com)"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <Button onClick={() => alert(domain)}>Scan</Button>
        </div>

        {/* Results */}
        <div className="bg-zinc-900 p-6 rounded-xl">
          <p>Subdomains will appear here...</p>
        </div>
      </main>
    </div>
  );
}
