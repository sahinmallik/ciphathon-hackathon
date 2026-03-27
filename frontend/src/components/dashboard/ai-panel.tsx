import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AiPanel() {
  return (
    <Card className="bg-zinc-900 border-none flex flex-col">
      <CardContent className="p-4 flex flex-col h-full">
        <h3 className="mb-2">AI Security Officer</h3>

        <div className="flex-1 overflow-y-auto text-sm text-zinc-300">
          <p>AI: Your SPF record is missing. This can cause email failures.</p>
        </div>

        <Input placeholder="Ask about your security..." className="mt-2" />
      </CardContent>
    </Card>
  );
}
