"use client";

import { useState } from "react";
import Link from "next/link";

/* ── Tiny SVG icons ── */
const Icon = {
  Menu: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
  ),
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  Home: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  Terminal: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
  ),
  Swap: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3l4 4-4 4"/><path d="M20 7H4"/><path d="M8 21l-4-4 4-4"/><path d="M4 17h16"/></svg>
  ),
  Stake: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  ),
  Chat: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
  ),
  Chart: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
  ),
  Settings: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
  ),
  Send: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
  ),
  ArrowDown: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
  ),
};

const navItems = [
  { icon: <Icon.Home />, label: "Overview", active: true },
  { icon: <Icon.Terminal />, label: "Agent Console", active: false },
  { icon: <Icon.Swap />, label: "Swap", active: false },
  { icon: <Icon.Stake />, label: "Staking", active: false },
  { icon: <Icon.Chat />, label: "Chat", active: false },
  { icon: <Icon.Chart />, label: "Analytics", active: false },
  { icon: <Icon.Settings />, label: "Settings", active: false },
];

const stats = [
  { label: "Portfolio Value", value: "$12,847.32", change: "+4.2%", up: true },
  { label: "24h P&L", value: "+$312.18", change: "+2.5%", up: true },
  { label: "Active Positions", value: "7", change: "3 protocols", up: true },
  { label: "Total Swaps", value: "142", change: "Last: 3m ago", up: true },
];

type LogType = "info" | "success" | "warn" | "error";

const consoleLogs: { type: LogType; time: string; msg: string }[] = [
  { type: "info", time: "14:32:01", msg: "Scanning Jupiter routes..." },
  { type: "success", time: "14:32:03", msg: "Best route found: SOL → USDC (0.06% slippage)" },
  { type: "success", time: "14:32:05", msg: "Swap executed: 1.2 SOL → 198.42 USDC [tx: 5YqR...kF2a]" },
  { type: "info", time: "14:33:10", msg: "Checking Marinade staking APY..." },
  { type: "success", time: "14:33:12", msg: "mSOL APY: 7.24% — above threshold" },
  { type: "warn", time: "14:34:00", msg: "Slippage alert: RAY→USDC route degraded to 0.42%" },
  { type: "info", time: "14:34:15", msg: "Rebalancing portfolio: target 40% SOL / 35% USDC / 25% mSOL" },
  { type: "success", time: "14:34:18", msg: "Rebalance complete — 3 txns confirmed" },
];

const chatMessages = [
  { role: "user" as const, text: "What's my current yield?" },
  { role: "agent" as const, text: "Your blended APY across all positions is 6.8%. Marinade mSOL is your top performer at 7.24%." },
  { role: "user" as const, text: "Swap 0.5 SOL to USDC" },
  { role: "agent" as const, text: "Routed via Jupiter. Swapped 0.5 SOL → 82.65 USDC at 0.04% slippage. Tx confirmed." },
];

const stakingPositions = [
  { token: "mSOL", protocol: "Marinade", apy: "7.24%", staked: "24.5 SOL", fill: 72 },
  { token: "jitoSOL", protocol: "Jito", apy: "7.01%", staked: "12.0 SOL", fill: 45 },
  { token: "bSOL", protocol: "BlazeStake", apy: "6.89%", staked: "8.2 SOL", fill: 30 },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");

  return (
    <div className="flex min-h-screen bg-[#f0fdf4]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="flex items-center justify-between p-4 border-b border-green-700">
          <Link href="/" className="flex items-center gap-2 text-base font-bold tracking-tight">
            <span className="text-gradient-light">Swan</span>
            <span className="text-green-300 font-medium">AI</span>
          </Link>
          <button
            className="lg:hidden text-green-300 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <Icon.X />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className={`nav-item ${item.active ? "active" : ""}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        {/* Agent Status */}
        <div className="p-4 border-t border-green-700">
          <div className="flex items-center gap-2 text-xs text-green-300">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            Agent Active
          </div>
          <div className="mt-1 text-[10px] text-green-500 font-[family-name:var(--font-jetbrains)]">
            v0.1.0-mvp · mainnet-beta
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-green-200 bg-white/90 backdrop-blur-lg px-4 py-3 lg:px-6">
          <button
            className="lg:hidden text-green-700 hover:text-green-900"
            onClick={() => setSidebarOpen(true)}
          >
            <Icon.Menu />
          </button>
          <h1 className="text-sm font-semibold text-green-800">Dashboard Overview</h1>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[11px] text-green-700 font-[family-name:var(--font-jetbrains)]">
              7xKp...mN3d
            </span>
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-green-400 to-green-600" />
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-5">
          {/* ── Stats Grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="text-[11px] text-green-600 font-medium uppercase tracking-wider">
                  {s.label}
                </div>
                <div className="mt-1 text-xl font-bold font-[family-name:var(--font-jetbrains)] text-green-900">
                  {s.value}
                </div>
                <div className="mt-0.5 text-xs text-green-600">{s.change}</div>
              </div>
            ))}
          </div>

          {/* ── Agent Console ── */}
          <div className="panel">
            <div className="panel-header">
              <span className="flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                Agent Console
              </span>
              <span className="text-[11px] text-green-600 font-[family-name:var(--font-jetbrains)]">
                live
              </span>
            </div>
            <div className="panel-body max-h-52 overflow-y-auto console-log">
              {consoleLogs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-green-500 shrink-0">{log.time}</span>
                  <span
                    className={
                      log.type === "success"
                        ? "log-success"
                        : log.type === "warn"
                          ? "log-warn"
                          : log.type === "error"
                            ? "log-error"
                            : "log-info"
                    }
                  >
                    {log.msg}
                  </span>
                </div>
              ))}
              <div className="flex gap-3 mt-1">
                <span className="text-green-500">14:34:20</span>
                <span className="log-info">
                  Awaiting next trigger<span className="blink">_</span>
                </span>
              </div>
            </div>
          </div>

          {/* ── Two-Column: Chat + Panels ── */}
          <div className="grid gap-5 lg:grid-cols-2">
            {/* Chat UI */}
            <div className="panel flex flex-col">
              <div className="panel-header">
                <span className="flex items-center gap-2">
                  <Icon.Chat />
                  Agent Chat
                </span>
              </div>
              <div className="panel-body flex-1 space-y-3 max-h-72 overflow-y-auto">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={
                        msg.role === "user" ? "chat-bubble-user" : "chat-bubble-agent"
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-green-200 p-3">
                <form
                  className="flex items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setChatInput("");
                  }}
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask SwanAI..."
                    className="flex-1 rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-900 placeholder:text-green-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                  />
                  <button
                    type="submit"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-600 text-white hover:bg-green-500 transition-colors shrink-0"
                  >
                    <Icon.Send />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Stack: Swap + Staking */}
            <div className="space-y-5">
              {/* Swap Panel */}
              <div className="panel">
                <div className="panel-header">
                  <span className="flex items-center gap-2">
                    <Icon.Swap />
                    Quick Swap
                  </span>
                  <span className="text-[11px] text-green-600">Jupiter</span>
                </div>
                <div className="panel-body space-y-3">
                  <div className="swap-input">
                    <div>
                      <div className="text-[10px] text-green-600 uppercase mb-1">From</div>
                      <div className="text-lg font-bold font-[family-name:var(--font-jetbrains)] text-green-900">
                        2.5
                      </div>
                    </div>
                    <div className="token-badge">
                      <span className="h-4 w-4 rounded-full bg-gradient-to-br from-purple-400 to-blue-400" />
                      SOL
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-600">
                      <Icon.ArrowDown />
                    </div>
                  </div>
                  <div className="swap-input">
                    <div>
                      <div className="text-[10px] text-green-600 uppercase mb-1">To</div>
                      <div className="text-lg font-bold font-[family-name:var(--font-jetbrains)] text-green-900">
                        412.38
                      </div>
                    </div>
                    <div className="token-badge">
                      <span className="h-4 w-4 rounded-full bg-gradient-to-br from-green-400 to-teal-400" />
                      USDC
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-green-600">
                    <span>Slippage: 0.08%</span>
                    <span>Route: SOL → wSOL → USDC</span>
                  </div>
                  <button className="btn-primary w-full justify-center text-sm !py-2.5">
                    Execute Swap
                  </button>
                </div>
              </div>

              {/* Staking Panel */}
              <div className="panel">
                <div className="panel-header">
                  <span className="flex items-center gap-2">
                    <Icon.Stake />
                    Staking Positions
                  </span>
                  <span className="text-[11px] text-green-600">3 active</span>
                </div>
                <div className="panel-body space-y-4">
                  {stakingPositions.map((pos) => (
                    <div key={pos.token}>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="token-badge text-[11px]">{pos.token}</span>
                          <span className="text-[11px] text-green-600">{pos.protocol}</span>
                        </div>
                        <span className="text-xs text-green-600 font-[family-name:var(--font-jetbrains)]">
                          {pos.apy} APY
                        </span>
                      </div>
                      <div className="staking-bar">
                        <div
                          className="staking-bar-fill"
                          style={{ width: `${pos.fill}%` }}
                        />
                      </div>
                      <div className="mt-1 text-[10px] text-green-500">
                        Staked: {pos.staked}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
