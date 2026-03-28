"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs"; // Added for security
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Send, Bot, User, Loader2 } from "lucide-react";

export default function AiChatSheet({ domain, contextData }: any) {
  const { user } = useUser(); // Get the authenticated user
  const [messages, setMessages] = useState<any[]>([
    {
      role: "assistant",
      content: `Hello! I've analyzed ${domain}. How can I help you understand your security posture today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // Controlled state for the sheet

  const sendMessage = async () => {
    if (!input.trim() || !user) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          context: contextData,
          domain: domain,
          clerkId: user.id, // PASSING CLERK ID FOR BACKEND VALIDATION
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch");

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: error.message.includes("authorized")
            ? "Access Denied: You are not authorized to discuss this domain."
            : "I'm having trouble connecting to my brain. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold gap-2 shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all"
      >
        <Sparkles className="w-4 h-4" />
        ASK AI
      </Button>

      <SheetContent className="bg-[#0A0A0B] border-zinc-800 text-white w-[400px] sm:w-[540px] flex flex-col p-0 shadow-2xl">
        <SheetHeader className="p-6 border-b border-zinc-800 bg-zinc-900/20">
          <SheetTitle className="text-white flex items-center gap-2">
            <Bot className="text-cyan-400 w-5 h-5" />
            Security Advisor
          </SheetTitle>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
              Live Context: {domain}
            </p>
          </div>
        </SheetHeader>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-cyan-600 text-white rounded-tr-none shadow-lg shadow-cyan-900/20"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none"
                }`}
              >
                <div className="flex items-center gap-2 mb-2 opacity-50 text-[9px] font-black uppercase tracking-tighter">
                  {m.role === "user" ? (
                    <User className="w-3 h-3" />
                  ) : (
                    <Bot className="w-3 h-3" />
                  )}
                  {m.role === "user" ? "Operator" : "Kyronyx AI"}
                </div>
                {/* whitespace-pre-wrap ensures AI's step-by-step lists look correct */}
                <div className="whitespace-pre-wrap font-sans">{m.content}</div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span className="text-[10px] font-mono text-zinc-500 uppercase animate-pulse">
                  Analyzing context...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
          <div className="flex gap-2 bg-zinc-900/50 p-1.5 rounded-xl border border-zinc-800 focus-within:border-cyan-500/50 transition-all shadow-inner">
            <Input
              placeholder="How do I fix my SSL certificate?"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-zinc-600 text-sm h-10"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-cyan-600 hover:bg-cyan-500 rounded-lg aspect-square p-0 w-10 h-10 shrink-0 shadow-lg shadow-cyan-500/10"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[9px] text-zinc-700 mt-3 text-center uppercase tracking-widest font-mono">
            Encrypted Session | Powered by Kyronyx Intelligence
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
