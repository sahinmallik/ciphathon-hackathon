import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FindingsTable() {
  return (
    <Card className="col-span-2 bg-zinc-900 border-none">
      <CardContent className="p-4">
        <h3 className="mb-4">Security Findings</h3>

        <table className="w-full text-sm">
          <thead className="text-zinc-400">
            <tr>
              <th className="text-left">Issue</th>
              <th>Severity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t border-zinc-800">
              <td>Missing SPF Record</td>
              <td className="text-yellow-400">Medium</td>
              <td>Open</td>
              <td>
                <Button size="sm">Fix</Button>
              </td>
            </tr>

            <tr className="border-t border-zinc-800">
              <td>Expired SSL</td>
              <td className="text-red-400">High</td>
              <td>Open</td>
              <td>
                <Button size="sm">Fix</Button>
              </td>
            </tr>
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
