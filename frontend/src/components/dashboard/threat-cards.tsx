import { Card, CardContent } from "@/components/ui/card";

export default function ThreatCards({ tls, email, reputation }: any) {
  const data = [
    {
      title: "SSL Validity",
      value: tls?.valid || "N/A",
      color: tls?.valid === "Valid" ? "text-green-400" : "text-red-400",
    },
    {
      title: "SPF Status",
      value: email?.spf?.exists ? "Protected" : "Vulnerable",
      color: email?.spf?.exists ? "text-green-400" : "text-yellow-400",
    },
    {
      title: "Reputation",
      value: reputation?.level?.toUpperCase() || "PENDING",
      color: reputation?.level === "good" ? "text-green-400" : "text-red-400",
    },
    {
      title: "Days to Expiry",
      value: tls?.daysRemaining ? `${tls.daysRemaining}d` : "N/A",
      color: "text-cyan-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map((item) => (
        <Card
          key={item.title}
          className="bg-zinc-900 border border-zinc-800/50"
        >
          <CardContent className="p-4">
            <p className="text-[10px] text-zinc-200 uppercase font-bold tracking-tight mb-1">
              {item.title}
            </p>
            <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
