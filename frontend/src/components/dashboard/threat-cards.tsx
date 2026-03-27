import { Card, CardContent } from "@/components/ui/card";

export default function ThreatCards() {
  const data = [
    { title: "SSL", value: "Valid", color: "text-green-400" },
    { title: "DNS", value: "SPF Missing", color: "text-yellow-400" },
    { title: "Reputation", value: "Clean", color: "text-green-400" },
    { title: "Assets", value: "3 Exposed", color: "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {data.map((item) => (
        <Card key={item.title} className="bg-zinc-900 border-none">
          <CardContent className="p-4">
            <p className="text-sm text-zinc-400">{item.title}</p>
            <p className={`text-lg font-semibold ${item.color}`}>
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
