import { ShieldCheck, ShieldAlert, Loader2, Terminal } from "lucide-react";

export default function PortScannerCard({
  data,
  loading,
}: {
  data: any;
  loading: boolean;
}) {
  if (loading)
    return (
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin mb-4" />
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
          Scanning Network Perimeter...
        </p>
      </div>
    );

  if (!data) return null;

  return (
    <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-6">
      <h3 className="text-white font-black uppercase italic mb-6 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-cyan-400" /> Active Ports
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {data.openPorts.map((p: any) => (
          <div
            key={p.port}
            className="bg-black border border-zinc-800 p-4 rounded-lg flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] text-zinc-500 font-mono">PORT</span>
              <p className="text-lg font-bold">{p.port}</p>
            </div>
            {[80, 443].includes(p.port) ? (
              <ShieldCheck className="text-emerald-500 w-5 h-5" />
            ) : (
              <ShieldAlert className="text-orange-500 w-5 h-5 animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
