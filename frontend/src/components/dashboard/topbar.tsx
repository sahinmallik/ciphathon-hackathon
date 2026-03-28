import { Button } from "../../components/ui/button";

export default function Topbar() {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-semibold">Security Dashboard</h2>
      <Button className="bg-cyan-500 hover:bg-cyan-600">Scan Now</Button>
    </div>
  );
}
