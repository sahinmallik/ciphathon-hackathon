import { Alert } from "@/components/ui/alert";

export default function Alerts() {
  return (
    <Alert className="bg-red-900/30 border border-red-500">
      🚨 Domain Blacklisted! Immediate action required.
    </Alert>
  );
}
