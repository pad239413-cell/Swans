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
function IconSolana() {
  return (
    <svg width="16" height="16" viewBox="0 0 128 128" fill="none">
      <path d="M93.94,42.63H13.78a1.25,1.25,0,0,1,0-2.5H93.94a1.25,1.25,0,0,1,0,2.5Z" fill="currentColor"/>
      <path d="M38.58,30.75a1.25,1.25,0,0,1-.88-2.13L51.83,14.49a1.25,1.25,0,0,1,1.77,1.77L39.47,30.38A1.24,1.24,0,0,1,38.58,30.75Z" fill="currentColor"/>
      <path d="M93.94,106.12H13.78a1.25,1.25,0,0,1,0-2.5H93.94a1.25,1.25,0,0,1,0,2.5Z" fill="currentColor"/>
      <path d="M38.58,118a1.24,1.24,0,0,1-.88-.36L23.56,103.5a1.25,1.25,0,0,1,1.77-1.77l14.14,14.14a1.25,1.25,0,0,1-.88,2.13Z" fill="currentColor"/>
      <path d="M93.94,74.38H13.78a1.25,1.25,0,0,1,0-2.5H93.94a1.25,1.25,0,0,1,0,2.5Z" fill="currentColor"/>
      <path d="M38.58,86.25a1.25,1.25,0,0,1-.88-2.13L51.83,70a1.25,1.25,0,0,1,1.77,1.77L39.47,85.89A1.24,1.24,0,0,1,38.58,86.25Z" fill="currentColor"/>
      <path d="M117.15,128H69.08a1.25,1.25,0,0,1-1.25-1.25V1.25A1.25,1.25,0,0,1,69.08,0h48.06a1.25,1.25,0,0,1,1.25,1.25V126.75A1.25,1.25,0,0,1,117.15,128ZM70.33,125.5h45.56V2.5H70.33Z" fill="currentColor"/>
    </svg>
  );
}
function IconArrowDown() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>
  );
}

// SVG Token Logos
function LogoSOL() {
  return (
    <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="64" fill="url(#solana-gradient)"/>
      <path d="M93.94,42.63H13.78a1.25,1.25,0,0,1,0-2.5H93.94a1.25,1.25,0,0,1,0,2.5Z" fill="white"/>
      <path d="M38.58,30.75a1.25,1.25,0,0,1-.88-2.13L51.83,14.49a1.25,1.25,0,0,1,1.77,1.77L39.47,30.38A1.24,1.24,0,0,1,38.58,30.75Z" fill="white"/>
      <path d="M93.94,106.12H13.78a1.25,1.25,0,0,1,0-2.5H93.94a1.25,1.25,0,0,1,0,2.5Z" fill="white"/>
      <path d="M38.58,118a1.24,1.24,0,0,1-.88-.36L23.56,103.5a1.25,1.25,0,0,1,1.77-1.77l14.14,14.14a1.25,1.25,0,0,1-.88,2.13Z" fill="white"/>
      <path d="M93.94,74.38H13.78a1.25,1.25,0,0,1,0-2.5H93.94a1.25,1.25,0,0,1,0,2.5Z" fill="white"/>
      <path d="M38.58,86.25a1.25,1.25,0,0,1-.88-2.13L51.83,70a1.25,1.25,0,0,1,1.77,1.77L39.47,85.89A1.24,1.24,0,0,1,38.58,86.25Z" fill="white"/>
      <defs>
        <linearGradient id="solana-gradient" x1="0" y1="0" x2="128" y2="128" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#9945FF"/>
          <stop offset="1" stopColor="#14F195"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
function LogoUSDC() {
  return (
    <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="64" fill="#2775CA"/>
      <path d="M64 108C88.3005 108 108 88.3005 108 64C108 39.6995 88.3005 20 64 20C39.6995 20 20 39.6995 20 64C20 88.3005 39.6995 108 64 108Z" fill="white"/>
      <path d="M82.48 55.74C82.48 47.67 76.92 44.97 67.11 44.23V34H61.05V44.12C59.62 44.12 58.17 44.15 56.73 44.19V34H50.67V44.23C49.13 44.26 39.99 44.19 39.99 44.19V50.56C39.99 50.56 44.43 50.49 46.13 50.49C49.02 50.49 49.81 51.79 49.81 53.71V75.17C49.52 76.6 48.46 77.69 46.13 77.69C44.43 77.69 39.99 77.62 39.99 77.62V83.99H50.67V94.32H56.73V84.03C58.19 84.06 59.62 84.06 61.05 84.06V94.32H67.11V83.96C79.59 83.19 87 80.29 87 69.14C87 59.89 81.84 57.56 75.47 56.86C79.34 55.74 82.48 53.23 82.48 55.74ZM61.09 78.2C57.58 78.2 54.1 77.94 50.67 77.43V68.11C52.56 68.44 54.48 68.7 56.41 68.94C60.48 69.4 68.2 69.57 68.2 73.7C68.2 77.09 64.99 78.2 61.09 78.2ZM56.41 63.58C54.55 63.38 52.63 63.09 50.67 62.72V54.03C52.42 54.42 54.21 54.65 56.02 54.82C59.47 55.14 64.23 55.63 64.23 59.13C64.23 62.43 60.55 63.88 56.41 63.58Z" fill="#2775CA"/>
    </svg>
  );
}
function LogoMSOL() {
  return (
    <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="64" fill="#FBBF24"/>
      <path d="M34 34L62.5 94L94 34" stroke="#065F46" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M34 94H94" stroke="#065F46" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function LogoJITO() {
  return (
    <svg width="20" height="20" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="128" height="128" rx="64" fill="#059669"/>
      <circle cx="64" cy="64" r="30" stroke="white" strokeWidth="8"/>
      <circle cx="64" cy="64" r="10" fill="white"/>
    </svg>
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
  { label: "NFT Sniper", status: "Soon", color: "bg-zinc-400" },
  { label: "Cross-Chain Bridge", status: "Soon", color: "bg-zinc-400" },
];

export default function Home() {
  return (
    <div className="bg-green-premium relative min-h-screen">
      {/* Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* ── Navbar ── */}
      <nav className="navbar sticky top-0 z-30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="text-gradient" data-text="Swan">Swan</span>
            <span className="text-green-700 font-medium">AI</span>
          </Link>
          <div className="hidden gap-6 text-sm text-green-800 md:flex">
            <a href="#features" className="hover:text-green-600 transition-colors">Features</a>
            <a href="#how" className="hover:text-green-600 transition-colors">How It Works</a>
            <a href="#modules" className="hover:text-green-600 transition-colors">Modules</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="btn-primary text-sm !py-2 !px-5">
              Launch App <IconArrow />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Pulsing Network Dots with Lines ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="network-dot" style={{ top: "12%", left: "8%" }} />
        <div className="network-line" style={{ top: "12%", left: "10%", width: "15%", transform: "rotate(25deg)" }} />
        <div className="network-dot" style={{ top: "28%", left: "85%" }} />
        <div className="network-line" style={{ top: "40%", left: "55%", width: "30%", transform: "rotate(-15deg)" }} />
        <div className="network-dot" style={{ top: "55%", left: "15%" }} />
        <div className="network-line" style={{ top: "50%", left: "20%", width: "20%", transform: "rotate(-30deg)" }} />
        <div className="network-dot" style={{ top: "70%", left: "92%" }} />
        <div className="network-dot" style={{ top: "40%", left: "50%" }} />
        <div className="network-line" style={{ top: "55%", left: "25%", width: "25%", transform: "rotate(45deg)" }} />
        <div className="network-dot" style={{ top: "85%", left: "35%" }} />
        <div className="network-dot" style={{ top: "18%", left: "65%" }} />
        <div className="network-line" style={{ top: "22%", left: "40%", width: "25%", transform: "rotate(10deg)" }} />
        <div className="network-dot" style={{ top: "62%", left: "72%" }} />
        <div className="network-line" style={{ top: "55%", left: "60%", width: "15%", transform: "rotate(-20deg)" }} />
      </div>

      {/* ── Hero ── */}
      <section className="scanlines relative mx-auto max-w-6xl px-5 pb-20 pt-24 text-center md:pt-32 md:pb-28">
        <div className="relative z-10">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full badge-green px-4 py-1.5 text-xs font-medium">
            <span className="inline-block h-2 w-2 rounded-full badge-dot animate-pulse" />
            Solana Mainnet &middot; MVP Live
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-green-900 sm:text-5xl lg:text-6xl">
            Autonomous DeFi Agent <br className="hidden sm:block" />
            for <span className="text-gradient" data-text="Solana">Solana</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-green-800 leading-relaxed sm:text-lg">
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

          {/* Terminal Demo - Enhanced */}
          <div className="mx-auto mt-14 max-w-2xl terminal glow-green fade-up">
            <div className="terminal-bar">
              <div className="terminal-dot bg-red-500/80" />
              <div className="terminal-dot bg-yellow-500/80" />
              <div className="terminal-dot bg-green-500/80" />
              <span className="ml-3 text-xs text-green-400/60">swan-agent — session_0xA3f</span>
            </div>
            <div className="terminal-body text-left">
              <div className="terminal-line">
                <span className="dollar">$</span> <span className="command">swan</span> <span className="param">init</span> <span className="param">--network</span> <span className="string">mainnet-beta</span>
              </div>
              <div className="terminal-line">
                <span className="log-info">[info]</span> Connecting to Solana RPC...
              </div>
              <div className="terminal-line">
                <span className="log-success">[ok]</span> Wallet linked: <span className="string">7xKp...mN3d</span>
              </div>
              <div className="terminal-line">
                <span className="log-info">[info]</span> Scanning Jupiter routes for <span className="param">SOL→USDC</span>
              </div>
              <div className="terminal-line">
                <span className="log-success">[ok]</span> Best route: <span className="param">SOL → wSOL → USDC</span> (<span className="number">0.08%</span> slippage)
              </div>
              <div className="terminal-line">
                <span className="log-info">[info]</span> Executing swap: <span className="number">2.5</span> <span className="param">SOL</span> → <span className="number">412.38</span> <span className="param">USDC</span>
              </div>
              <div className="terminal-line">
                <span className="log-success">[ok]</span> Tx confirmed: <span className="string">5YqR...kF2a</span> <span className="blink"></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="bg-hex-grid relative z-10 mx-auto max-w-6xl px-5 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-green-900">
            Built for <span className="text-gradient" data-text="Performance">Performance</span>
          </h2>
          <p className="mt-3 text-green-700 max-w-lg mx-auto">
            Every module is purpose-built for speed, safety, and yield on Solana.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="card-glossy fade-up p-6">
              <div className="feature-icon mb-4">
                {f.icon}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-green-900">{f.title}</h3>
              <p className="text-sm text-green-700 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="bg-3d-grid relative z-10 mx-auto max-w-4xl px-5 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-green-900">
            How It <span className="text-gradient" data-text="Works">Works</span>
          </h2>
          <p className="mt-3 text-green-700">Four steps from connect to compound.</p>
        </div>
        <div className="space-y-6">
          {steps.map((s) => (
            <div key={s.n} className="flex items-start gap-5 card-glossy fade-up p-6">
              <div className="step-number">{s.n}</div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">{s.title}</h3>
                <p className="mt-1 text-sm text-green-700 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Modules ── */}
      <section id="modules" className="bg-hex-grid relative z-10 mx-auto max-w-4xl px-5 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-green-900">
            Agent <span className="text-gradient" data-text="Modules">Modules</span>
          </h2>
          <p className="mt-3 text-green-700">Composable modules powering the SwanAI stack.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <div key={m.label} className="card-glossy flex items-center justify-between fade-up p-5">
              <span className="font-medium text-sm text-green-900">{m.label}</span>
              <span className="inline-flex items-center gap-1.5 text-xs text-green-700">
                <span className={`inline-block h-2 w-2 rounded-full ${m.color}`} />
                {m.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 mx-auto max-w-3xl px-5 py-24 text-center">
        <div className="rounded-2xl cta-card">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-green-900">
            Ready to put your <span className="text-gradient" data-text="portfolio on autopilot">portfolio on autopilot</span>?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-green-700 leading-relaxed">
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
      <footer className="navbar relative z-10 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-xs text-green-600 sm:flex-row sm:justify-between">
          <span>&copy; {new Date().getFullYear()} SwanAI. All rights reserved.</span>
          <div className="flex gap-5">
            <a href="#" className="hover:text-green-800 transition-colors">Docs</a>
            <a href="#" className="hover:text-green-800 transition-colors">Twitter</a>
            <a href="#" className="hover:text-green-800 transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}