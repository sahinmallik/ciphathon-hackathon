import Header from "@/components/Header";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Server Component - Handles Clerk Auth & DB Sync */}
      <Header />

      {/* Client Component - Handles Inputs & State */}
      <HomeClient />
    </div>
  );
}
