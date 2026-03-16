import Link from "next/link";

/* ── SVG icon helpers (inline, no deps) ── */
function IconBot() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" /><circle cx="12" cy="5" r="2" /><path d="M12 7v4" /><circle cx="8" cy="16" r="1" /><circle cx="16" cy="16" r="1" /></svg>
  );
}
function IconSwap() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3l4 4-4 4" /><path d="M20 7H4" /><path d="M8 21l-4-4 4-4" /><path d="M4 17h16" /></svg>
  );
}
function IconShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  );
}
function IconZap() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  );
}
function IconChart() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
  );
}
function IconGlobe() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
  );
}
function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
  );
}

/* ── Data ── */
const features = [
  { icon: <IconBot />, title: "Autonomous Agent", desc: "AI agent that executes DeFi strategies 24/7 with zero manual intervention." },
  { icon: <IconSwap />, title: "Instant Swaps", desc: "Best-route token swaps across Jupiter, Raydium, and Orca aggregators." },
  { icon: <IconShield />, title: "Risk Engine", desc: "Real-time risk scoring with position limits, slippage guards, and circuit breakers." },
  { icon: <IconZap />, title: "Yield Optimizer", desc: "Auto-compounds staking rewards and rotates into highest APY vaults." },
  { icon: <IconChart />, title: "Portfolio Analytics", desc: "Live P&L, allocation breakdowns, and on-chain transaction history." },
  { icon: <IconGlobe />, title: "Multi-Protocol", desc: "Native integrations with Marinade, Jito, Tensor, and more Solana protocols." },
];

const steps = [
  { n: "01", title: "Connect Wallet", desc: "Link your Solana wallet — Phantom, Solflare, or Backpack. Read-only by default." },
  { n: "02", title: "Set Strategy", desc: "Choose risk tolerance, target allocations, and which protocols to use." },
  { n: "03", title: "Agent Executes", desc: "SwanAI monitors markets, rebalances, stakes, and swaps autonomously." },
  { n: "04", title: "Track & Earn", desc: "Watch real-time analytics, review every transaction, and withdraw anytime." },
];

const modules = [
  { label: "Swap Engine", status: "Live", color: "bg-green-500" },
  { label: "Staking Agent", status: "Live", color: "bg-green-500" },
  { label: "Yield Vault", status: "Beta", color: "bg-yellow-500" },
  { label: "Risk Engine", status: "Live", color: "bg-green-500" },
  { label: "NFT Sniper", status: "Soon", color: "bg-zinc-500" },
  { label: "Cross-Chain Bridge", status: "Soon", color: "bg-zinc-500" },
];

export default function Home() {
  return (
    <div className="bg-grid relative min-h-screen">
      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-30 border-b border-[#1e1e2a] bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="text-gradient">Swan</span>
            <span className="text-zinc-400 font-medium">AI</span>
          </Link>
          <div className="hidden gap-6 text-sm text-zinc-400 md:flex">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How It Works</a>
            <a href="#modules" className="hover:text-white transition-colors">Modules</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn-primary text-sm !py-2 !px-5">
              Launch App <IconArrow />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Pulsing Network Dots ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="network-dot" style={{ top: "12%", left: "8%" }} />
        <div className="network-dot" style={{ top: "28%", left: "85%" }} />
        <div className="network-dot" style={{ top: "55%", left: "15%" }} />
        <div className="network-dot" style={{ top: "70%", left: "92%" }} />
        <div className="network-dot" style={{ top: "40%", left: "50%" }} />
        <div className="network-dot" style={{ top: "85%", left: "35%" }} />
        <div className="network-dot" style={{ top: "18%", left: "65%" }} />
        <div className="network-dot" style={{ top: "62%", left: "72%" }} />
      </div>

      {/* ── Hero ── */}
      <section className="scanlines relative mx-auto max-w-6xl px-5 pb-20 pt-24 text-center md:pt-32 md:pb-28">
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#1e1e2a] bg-[#111118] px-4 py-1.5 text-xs font-medium text-zinc-400">
            <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            Solana Mainnet &middot; MVP Live
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            Autonomous DeFi Agent <br className="hidden sm:block" />
            for <span className="text-gradient">Solana</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-zinc-400 leading-relaxed sm:text-lg">
            SwanAI executes swaps, manages staking, optimizes yield, and rebalances your portfolio
            — all on autopilot with institutional-grade risk controls.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-primary">
              Launch Dashboard <IconArrow />
            </Link>
            <a href="#features" className="btn-outline">
              Explore Features
            </a>
          </div>

          {/* Terminal Demo */}
          <div className="mx-auto mt-14 max-w-2xl terminal glow-green fade-up">
            <div className="terminal-bar">
              <div className="terminal-dot bg-red-500/80" />
              <div className="terminal-dot bg-yellow-500/80" />
              <div className="terminal-dot bg-green-500/80" />
              <span className="ml-3 text-xs text-zinc-500">swan-agent — session_0xA3f</span>
            </div>
            <div className="terminal-body text-left text-zinc-400">
              <div className="terminal-line"><span className="text-green-400">$</span> swan init --network mainnet-beta</div>
              <div className="terminal-line text-zinc-500">[info] Connecting to Solana RPC...</div>
              <div className="terminal-line text-green-400">[ok] Wallet linked: 7xKp...mN3d</div>
              <div className="terminal-line text-zinc-500">[info] Scanning Jupiter routes for SOL→USDC</div>
              <div className="terminal-line text-green-400">[ok] Best route: SOL → wSOL → USDC (0.08% slippage)</div>
              <div className="terminal-line text-zinc-500">[info] Executing swap: 2.5 SOL → 412.38 USDC</div>
              <div className="terminal-line text-green-400">[ok] Tx confirmed: 5YqR...kF2a <span className="blink">█</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="relative z-10 mx-auto max-w-6xl px-5 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Built for <span className="text-gradient">Performance</span>
          </h2>
          <p className="mt-3 text-zinc-400 max-w-lg mx-auto">
            Every module is purpose-built for speed, safety, and yield on Solana.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="feature-card fade-up">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-400">
                {f.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="relative z-10 mx-auto max-w-4xl px-5 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="mt-3 text-zinc-400">Four steps from connect to compound.</p>
        </div>
        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.n} className="flex items-start gap-5 feature-card fade-up">
              <div className="step-number">{s.n}</div>
              <div>
                <h3 className="text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modules ── */}
      <section id="modules" className="relative z-10 mx-auto max-w-4xl px-5 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Agent <span className="text-gradient">Modules</span>
          </h2>
          <p className="mt-3 text-zinc-400">Composable modules powering the SwanAI stack.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div key={m.label} className="feature-card flex items-center justify-between fade-up">
              <span className="font-medium text-sm">{m.label}</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                <span className={`inline-block h-2 w-2 rounded-full ${m.color}`} />
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 mx-auto max-w-3xl px-5 py-24 text-center">
        <div className="rounded-2xl border border-[#1e1e2a] bg-[#111118] p-10 sm:p-14 glow-green">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to put your <span className="text-gradient">portfolio on autopilot</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-zinc-400 leading-relaxed">
            Join the MVP and let SwanAI manage your Solana DeFi positions around the clock.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-primary">
              Launch Dashboard <IconArrow />
            </Link>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn-outline">
              View on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-[#1e1e2a] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-xs text-zinc-500 sm:flex-row sm:justify-between">
          <span>&copy; {new Date().getFullYear()} SwanAI. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-zinc-300 transition-colors">Docs</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Twitter</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
