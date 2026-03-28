import { Card, CardContent } from "@/components/ui/card";
import {
  Globe,
  Activity,
  Link2,
  AlertTriangle,
  ChevronRight,
  DatabaseZap,
  ShieldCheck,
} from "lucide-react";

interface SubdomainCardProps {
  data: any;
  loading: boolean;
}

export default function SubdomainCard({ data, loading }: SubdomainCardProps) {
  const hasData = data !== null;
  const summary = data?.summary || {
    total: 0,
    active: 0,
    dangling: 0,
    takeover: 0,
  };
  const results = data?.results || [];
  const noResultsFound = hasData && summary.total === 0;

  const stats = [
    {
      label: "Total Assets",
      value: summary.total,
      icon: Globe,
      color: "text-cyan-400",
    },
    {
      label: "Active Hosts",
      value: summary.active,
      icon: Activity,
      color: "text-emerald-400",
    },
    {
      label: "Dangling DNS",
      value: summary.dangling,
      icon: Link2,
      color: "text-yellow-500",
    },
    {
      label: "Takeover Risk",
      value: summary.takeover,
      icon: AlertTriangle,
      color: "text-red-500",
    },
  ];

  if (loading)
    return (
      <Card className="w-full bg-[#0A0A0B] border border-zinc-800 animate-pulse">
        <CardContent className="h-64 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
          <p className="text-[10px] font-mono text-zinc-200 uppercase tracking-[0.3em]">
            Enumerating_Subdomains...
          </p>
        </CardContent>
      </Card>
    );

  return (
    <Card className="w-full bg-[#0A0A0B] border border-zinc-800 shadow-2xl overflow-hidden group">
      <CardContent className="p-0">
        {/* Header HUD */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <DatabaseZap className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-bold text-zinc-100 uppercase tracking-tight text-sm">
                Target Infrastructure Map
              </h3>
              <p className="text-[10px] font-mono text-zinc-300">
                Global DNS Recursive Lookup
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full md:w-auto">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-start md:items-end">
                <span className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.2em] mb-1">
                  {stat.label}
                </span>
                <div className="flex items-center gap-2">
                  <stat.icon
                    className={`w-3 h-3 ${stat.value > 0 ? stat.color : "text-zinc-300"}`}
                  />
                  <span
                    className={`text-xl font-black font-mono tracking-tighter ${stat.value > 0 ? stat.color : "text-zinc-200"}`}
                  >
                    {stat.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-black/20">
          {summary.total > 0 ? (
            /* TABLE VIEW */
            <table className="w-full text-sm text-left">
              <thead className="sticky top-0 bg-[#0A0A0B] border-b border-zinc-300 text-[10px] font-bold uppercase tracking-widest text-zinc-400 z-20">
                <tr>
                  <th className="px-8 py-4">Network Endpoint</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Detection Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {results.map((res: any, i: number) => (
                  <tr
                    key={i}
                    className="hover:bg-cyan-500/[0.02] transition-all group/row"
                  >
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <ChevronRight className="w-3 h-3 text-zinc-700 group-hover/row:text-cyan-500 transition-colors" />
                        <span className="font-mono text-zinc-300 group-hover:text-white transition-colors">
                          {res.subdomain || res}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span
                        className={`px-3 py-1 rounded text-[10px] font-black border tracking-tighter ${
                          res.active
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            : "bg-zinc-800/50 border-zinc-700 text-zinc-600"
                        }`}
                      >
                        {res.active ? "ONLINE" : "OFFLINE"}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right font-mono text-[11px] text-zinc-600">
                      {new Date().toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : noResultsFound ? (
            /* SCAN COMPLETED - NO RESULTS FOUND */
            <div className="py-24 text-center">
              <div className="inline-block p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-zinc-100 uppercase tracking-widest">
                Perimeter Fortified
              </p>
              <p className="text-[10px] font-mono text-zinc-300 mt-2 uppercase">
                [ SCAN_COMPLETE: 0 EXTERNAL_ASSETS_DETECTED ]
              </p>
            </div>
          ) : (
            /* INITIAL STATE - WAITING FOR SCAN */
            <div className="py-24 text-center">
              <div className="inline-block p-4 rounded-full bg-zinc-900 border border-zinc-800 mb-4">
                <Link2 className="w-8 h-8 text-zinc-600 animate-pulse" />
              </div>
              <p className="text-xs font-mono text-zinc-500 uppercase tracking-[0.2em]">
                [ Awaiting Deep Discovery Initialization ]
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
