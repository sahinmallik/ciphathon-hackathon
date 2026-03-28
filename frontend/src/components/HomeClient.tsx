"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HomeClient() {
  const { user } = useUser();
  const router = useRouter();
  const [domain, setDomain] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:8080";

  const isValidDomain = (d: string) => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(d);

  const handleScanDomain = async () => {
    if (!isValidDomain(domain)) {
      alert("❌ Please enter a valid domain");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/owner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain,
          clerkId: user?.id,
        }),
      });

      const data = await res.json();

      // 1. Direct Redirect if domain exists and belongs to user
      if (data.redirect || data.message === "Domain already exist!!!") {
        router.push(`/dashboard?domain=${domain}`);
        return;
      }

      // 2. Success handling
      if (res.ok && data.success) {
        setSecretKey(data.secretKey);
        setShowPopup(true);
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      alert("Backend connection failed. Is your Elysia server running?");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDNS = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain, secretKey }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ " + data.message);
        router.push(`/dashboard?domain=${domain}`);
      } else {
        alert("❌ " + (data.message || "Verification failed"));
      }
    } catch (err) {
      alert("Verification error. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="w-full max-w-[380px] p-8 rounded-xl bg-zinc-900 border border-zinc-800 shadow-xl space-y-6">
        <h1 className="text-2xl font-semibold text-cyan-400">Kyronyx AI</h1>
        <div className="space-y-2">
          <label className="text-xs text-zinc-500 uppercase font-bold">
            Domain to Scan
          </label>
          <Input
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            className="bg-zinc-950 text-white border-zinc-700 focus:border-cyan-400"
          />
        </div>
        <Button
          variant="secondary"
          className="w-full font-semibold"
          onClick={handleScanDomain}
          disabled={loading}
        >
          {loading ? "Processing..." : "Scan Domain"}
        </Button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-[480px] p-6 rounded-lg bg-zinc-900 border border-zinc-800 shadow-2xl space-y-4">
            <h2 className="text-xl font-semibold text-cyan-400">
              Verify Ownership
            </h2>

            <div className="space-y-3">
              <p className="text-sm text-zinc-300">
                To verify <span className="text-white font-mono">{domain}</span>
                , please add the following TXT record to your DNS provider:
              </p>

              <div className="p-4 bg-black rounded-md border border-zinc-800">
                <p className="text-[10px] text-zinc-500 mb-1 uppercase tracking-widest">
                  TXT Value
                </p>
                <code className="text-cyan-300 break-all text-sm">
                  {secretKey}
                </code>
              </div>

              <div className="bg-zinc-800/30 p-3 rounded text-xs text-zinc-400 italic">
                Note: DNS changes can take up to 24 hours to propagate.
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1 border-zinc-700 text-zinc-400 hover:text-white"
                onClick={() => setShowPopup(false)}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black"
                onClick={handleVerifyDNS}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify DNS"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
