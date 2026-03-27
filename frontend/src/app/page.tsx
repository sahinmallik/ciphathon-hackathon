"use client";

import CyberBackground from "./CyberBackground";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [domain, setDomain] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const router = useRouter();

  const isValidDomain = (d: string) => {
    return /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(d);
  };

  const handleVerify = () => {
    if (!isValidDomain(domain)) {
      alert("❌ Please enter a valid domain (e.g., google.com)");
      return;
    }
    setShowPopup(true);
  };

  const goToDashboard = () => {
    router.push(`/dashboard?domain=${domain}`);
  };

  return (
    <CyberBackground>
      {/* MAIN CARD */}
      <div className="bg-zinc-900/80 backdrop-blur-xl p-10 rounded-2xl w-[420px] text-center space-y-6 border border-cyan-500 shadow-[0_0_40px_rgba(0,255,255,0.2)]">
        <h1 className="text-3xl font-bold text-cyan-400">Kyronyx AI</h1>

        <p className="text-zinc-300">Enter your domain to analyze security</p>

        <Input
          placeholder="Enter Domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
        />

        <Button
          className="w-full bg-cyan-500 hover:bg-cyan-600"
          onClick={handleVerify}
        >
          Verify Domain
        </Button>
      </div>

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900/90 backdrop-blur-xl p-6 rounded-xl w-[500px] space-y-4 border border-cyan-500 shadow-2xl">
            <h2 className="text-xl font-semibold text-cyan-400">Steps</h2>

            <p className="text-sm text-zinc-400">
              Domain: <span className="text-white">{domain}</span>
            </p>

            <div className="text-sm space-y-2">
              <p>
                🔍 <b>Assets:</b> Discover subdomains & endpoints
              </p>
              <p>
                ⚠️ <b>Threats:</b> Identify SSL, DNS, leaks
              </p>
              <p>
                📊 <b>Dashboard:</b> View security score
              </p>
              <p>
                🤖 <b>AI Officer:</b> Get fixes
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setShowPopup(false)}>
                Cancel
              </Button>

              <Button className="bg-cyan-500" onClick={goToDashboard}>
                Verify Domain →
              </Button>
            </div>
          </div>
        </div>
      )}
    </CyberBackground>
  );
}
