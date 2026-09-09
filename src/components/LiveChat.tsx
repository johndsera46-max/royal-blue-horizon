"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ChatMessage {
  id: number;
  from: "agent" | "user";
  text: string;
  time: string;
}

const OPENING: ChatMessage = {
  id: 0,
  from: "agent",
  text: "Hi, I'm Aria from the Royal Blue Horizon ops desk. Ask me about a shipment, a quote, or anything else — I'm here.",
  time: now(),
};

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function reply(input: string): string {
  const q = input.toLowerCase();
  if (/(track|where.*ship|status)/.test(q)) {
    return "You can track any shipment in real time on our Track page — try a number like RBH4821903, or send me yours and I'll point you there.";
  }
  if (/(book|quote|price|cost|rate)/.test(q)) {
    return "I can get that started — head to Request Booking and fill in your route and cargo details. Rated quotes typically land in about 11 minutes.";
  }
  if (/(customs|clearance|duty|duties)/.test(q)) {
    return "Our brokerage team clears documentation before arrival on every lane we operate — average clearance time is 6.2 hours from discharge.";
  }
  if (/(human|agent|person|talk to someone)/.test(q)) {
    return "This is a live capability preview, so I'm the interactive layer for now — but this is exactly where a real ops agent would pick up the thread.";
  }
  if (/(hour|open|time zone|available)/.test(q)) {
    return "The ops desk runs 24/7 across our Shanghai, Rotterdam, and Los Angeles hubs — someone is always on shift.";
  }
  if (/(thank|thanks|cool|nice|great)/.test(q)) {
    return "Anytime. Let me know if there's a shipment or booking I can help with.";
  }
  return "Got it — for anything shipment-specific, the Track and Request Booking pages will have the fastest answer, but tell me more and I'll do my best here.";
}

export default function LiveChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([OPENING]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg: ChatMessage = { id: Date.now(), from: "user", text, time: now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { id: Date.now() + 1, from: "agent", text: reply(text), time: now() }]);
    }, 900 + Math.random() * 700);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:right-7">
      <div
        className={`glass-strong glass-edge w-[calc(100vw-2.5rem)] max-w-sm origin-bottom-right overflow-hidden rounded-3xl transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
        style={{ height: open ? "min(560px, 70vh)" : 0 }}
        role="dialog"
        aria-label="Live chat"
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-royal-400 to-gold-400" />
              <div>
                <div className="text-sm font-medium text-ink-100">Aria · Ops desk</div>
                <div className="flex items-center gap-1.5 text-xs text-ink-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-signal-green shadow-[0_0_8px_2px_rgba(79,214,140,0.6)]" />
                  Typically replies in minutes
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-white/8 hover:text-ink-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] ${m.from === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      m.from === "user"
                        ? "rounded-br-md bg-gold-400 text-royal-950"
                        : "rounded-bl-md border border-white/10 bg-white/6 text-ink-100"
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="px-1 font-mono text-[10px] text-ink-500">{m.time}</span>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-white/6 px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-ink-300" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-ink-300" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 animate-pulse-glow rounded-full bg-ink-300" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 border-t border-white/10 px-5 py-3 text-xs text-ink-500">
            <Link href="/track" className="inline-flex items-center gap-1 hover:text-gold-300" onClick={() => setOpen(false)}>
              Track a shipment <ArrowRight className="h-3 w-3" />
            </Link>
            <span className="text-white/15">/</span>
            <Link href="/book" className="inline-flex items-center gap-1 hover:text-gold-300" onClick={() => setOpen(false)}>
              Request booking <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <form onSubmit={send} className="flex items-center gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message…"
              className="flex-1 rounded-full bg-white/6 px-4 py-2.5 text-sm text-ink-100 placeholder:text-ink-500 focus:outline-none"
              autoComplete="off"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-400 text-royal-950 transition-colors hover:bg-gold-300"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="glass-edge flex h-14 w-14 items-center justify-center rounded-full bg-gold-400 text-royal-950 shadow-[0_10px_30px_-6px_rgba(232,189,107,0.7)] transition-transform hover:scale-105"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
}
