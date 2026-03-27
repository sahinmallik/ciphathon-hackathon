"use client";

import { useRouter } from "next/navigation";

export default function Sidebar() {
  const router = useRouter();

  const items = [
    { name: "Dashboard", path: "/" },
    { name: "Assets", path: "/assets" },
    { name: "Threats", path: "/threats" },
    { name: "Reports", path: "/reports" },
    { name: "AI Assistant", path: "/ai" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-black/40 backdrop-blur-xl border-r border-zinc-800 p-6">
      <h1 className="text-xl font-bold text-cyan-400">Kyronyx AI</h1>

      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <div
            key={item.name}
            onClick={() => router.push(item.path)}
            className="cursor-pointer hover:text-cyan-400"
          >
            {item.name}
          </div>
        ))}
      </div>
    </aside>
  );
}
