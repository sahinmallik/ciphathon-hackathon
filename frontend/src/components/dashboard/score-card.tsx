import { Card, CardContent } from "@/components/ui/card";

export default function ScoreCard() {
  return (
    <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border-none">
      <CardContent className="p-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg">Security Score</h3>
          <p className="text-sm text-zinc-400">Live Maturity Rating</p>
        </div>
        <div className="text-6xl font-bold text-green-400">82</div>
      </CardContent>
    </Card>
  );
}
