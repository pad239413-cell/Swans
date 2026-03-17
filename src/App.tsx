import { useState, useEffect } from 'react';
import { Menu, Wifi, Cpu } from 'lucide-react';

import { startPriceEngine }       from '@/lib/engines/priceEngine';
import { startMEVEngine }         from '@/lib/engines/mevEngine';
import { startSocialFeed }        from '@/lib/engines/lunarcrush';
import { startSentimentEngine }   from '@/lib/engines/stockgeist';
import { startAgent }             from '@/lib/engines/agentEngine';
import { startNetworkEngine }     from '@/lib/engines/networkEngine';
import { generateResponse, updateChatContext } from '@/lib/engines/chatEngine';

import type { TokenPrice }                     from '@/lib/engines/priceEngine';
import type { MEVBundle, JitoStats }           from '@/lib/engines/mevEngine';
import type { SocialMetric }                   from '@/lib/engines/lunarcrush';
import type { StockgeistSignal, MarketSentiment } from '@/lib/engines/stockgeist';
import type { AgentAction, AgentStatus }       from '@/lib/engines/agentEngine';
import type { NetworkStats }                   from '@/lib/engines/networkEngine';

import Sidebar        from '@/components/dashboard/Sidebar';
import PricePanel     from '@/components/dashboard/PricePanel';
import MevPanel       from '@/components/dashboard/MevPanel';
import SocialPanel    from '@/components/dashboard/SocialPanel';
import SentimentPanel from '@/components/dashboard/SentimentPanel';
import AgentPanel     from '@/components/dashboard/AgentPanel';
import ChatPanel      from '@/components/dashboard/ChatPanel';
import NetworkPanel   from '@/components/dashboard/NetworkPanel';
import OverviewHero   from '@/components/dashboard/OverviewHero';
import PriceTicker    from '@/components/dashboard/PriceTicker';

const TAB_LABELS: Record<string, string> = {
  overview: 'Overview', prices: 'Live Prices', mev: 'MEV / Jito',
  social: 'Social Intel', sentiment: 'AI Predictions', agent: 'Agent',
  chat: 'SwanAI Chat', network: 'Solana Network',
};

export default function App() {
  const [activeTab,         setActiveTab]         = useState('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [prices,       setPrices]       = useState<Record<string, TokenPrice>>({});
  const [bundles,      setBundles]      = useState<MEVBundle[]>([]);
  const [jitoStats,    setJitoStats]    = useState<JitoStats | null>(null);
  const [social,       setSocial]       = useState<SocialMetric[]>([]);
  const [signals,      setSignals]      = useState<StockgeistSignal[]>([]);
  const [market,       setMarket]       = useState<MarketSentiment | null>(null);
  const [actions,      setActions]      = useState<AgentAction[]>([]);
  const [agentStatus,  setAgentStatus]  = useState<AgentStatus | null>(null);
  const [network,      setNetwork]      = useState<NetworkStats | null>(null);

  /* ── Start all engines on mount ── */
  useEffect(() => {
    const stopPrice     = startPriceEngine(setPrices);
    const stopMEV       = startMEVEngine((b, s) => { setBundles(b); setJitoStats(s); });
    const stopSocial    = startSocialFeed(setSocial);
    const stopSentiment = startSentimentEngine((sigs, mkt) => { setSignals(sigs); setMarket(mkt); });
    const stopAgent     = startAgent('balanced', (acts, st) => { setActions(acts); setAgentStatus(st); });
    const stopNetwork   = startNetworkEngine(setNetwork);

    return () => {
      stopPrice();
      stopMEV();
      stopSocial();
      stopSentiment();
      stopAgent();
      stopNetwork();
    };
  }, []);

  /* ── Keep chat context in sync with all engines ── */
  useEffect(() => {
    if (market) {
      updateChatContext(
        prices,
        signals,
        social,
        market,
        jitoStats && bundles.length ? { bundles, stats: jitoStats } : undefined,
        agentStatus && actions.length ? { actions, status: agentStatus } : undefined,
        network ?? undefined
      );
    }
  }, [prices, signals, social, market, bundles, jitoStats, actions, agentStatus, network]);

  const isReady = Object.keys(prices).length > 0;

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="text-4xl">🦢</div>
          <div className="text-gradient-green font-bold text-lg tracking-tight">SwanAI</div>
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Cpu size={14} className="animate-pulse text-primary" />
            <span>Initialising engines…</span>
          </div>
          <div className="flex gap-1.5 mt-2">
            {['Price', 'MEV', 'Social', 'AI', 'Agent', 'Network'].map((e, i) => (
              <div
                key={e}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-primary/30 text-primary/70"
                style={{ animation: `statusPulse 1.5s ease-in-out ${i * 0.2}s infinite` }}
              >
                {e}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        agentStatus={agentStatus}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Header */}
        <header className="h-10 shrink-0 flex items-center justify-between px-4 gap-3 bg-sidebar/80 border-b border-border/60 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-1 rounded text-muted-foreground hover:text-foreground"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu size={16} />
            </button>
            <span className="text-gradient-green font-bold text-sm tracking-tight lg:hidden">🦢 SwanAI</span>
            <span className="text-xs font-semibold uppercase tracking-widest hidden sm:block text-muted-foreground">
              {TAB_LABELS[activeTab] ?? activeTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Live price ticker — top tokens */}
            <div className="hidden md:flex items-center gap-3">
              {['SOL', 'JUP', 'WIF'].map(sym => {
                const t = prices[sym];
                if (!t) return null;
                return (
                  <span key={sym} className="flex items-center gap-1 font-mono text-[10px]">
                    <span className="text-muted-foreground">{sym}</span>
                    <span className="text-foreground">${t.price.toFixed(2)}</span>
                    <span className={t.change24h >= 0 ? 'text-chart-1' : 'text-destructive'}>
                      {t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(1)}%
                    </span>
                  </span>
                );
              })}
            </div>

            <span className="flex items-center gap-1.5 font-mono text-[10px] text-chart-1">
              <Wifi size={10} />
              Live
            </span>
            {agentStatus && (
              <span className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                <span className="status-dot" />
                <span className="hidden sm:inline">Agent {agentStatus.mode}</span>
                <span className="sm:hidden">Agent</span>
              </span>
            )}
          </div>
        </header>

        {/* Live price ticker strip */}
        <PriceTicker prices={prices} />

        {/* Panel content */}
        <main className="flex-1 overflow-y-auto p-2">

          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-2 h-full animate-fade-in">
              <OverviewHero
                prices={prices}
                jitoStats={jitoStats}
                market={market}
                agentStatus={agentStatus}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 flex-1 min-h-0">
                <div className="min-h-0 flex flex-col" style={{ minHeight: '320px' }}>
                  <PricePanel prices={prices} />
                </div>
                <div className="min-h-0 flex flex-col" style={{ minHeight: '320px' }}>
                  {jitoStats && <MevPanel bundles={bundles} stats={jitoStats} />}
                </div>
                <div className="min-h-0 flex flex-col" style={{ minHeight: '320px' }}>
                  {market && <SentimentPanel signals={signals} market={market} />}
                </div>
                <div className="min-h-0 flex flex-col" style={{ minHeight: '320px' }}>
                  {agentStatus && <AgentPanel actions={actions} status={agentStatus} />}
                </div>
              </div>
            </div>
          )}

          {/* PRICES */}
          {activeTab === 'prices' && (
            <div className="h-full animate-fade-in">
              <PricePanel prices={prices} />
            </div>
          )}

          {/* MEV */}
          {activeTab === 'mev' && jitoStats && (
            <div className="h-full animate-fade-in">
              <MevPanel bundles={bundles} stats={jitoStats} />
            </div>
          )}

          {/* SOCIAL */}
          {activeTab === 'social' && (
            <div className="h-full animate-fade-in">
              <SocialPanel metrics={social} />
            </div>
          )}

          {/* SENTIMENT */}
          {activeTab === 'sentiment' && market && (
            <div className="h-full animate-fade-in">
              <SentimentPanel signals={signals} market={market} />
            </div>
          )}

          {/* AGENT */}
          {activeTab === 'agent' && agentStatus && (
            <div className="h-full animate-fade-in">
              <AgentPanel actions={actions} status={agentStatus} />
            </div>
          )}

          {/* CHAT */}
          {activeTab === 'chat' && (
            <div className="h-full animate-fade-in" style={{ minHeight: '500px' }}>
              <ChatPanel onSendMessage={generateResponse} />
            </div>
          )}

          {/* NETWORK */}
          {activeTab === 'network' && network && (
            <div className="h-full animate-fade-in">
              <NetworkPanel stats={network} />
            </div>
          )}

          {activeTab === 'network' && !network && (
            <div className="flex items-center justify-center h-full gap-2 text-muted-foreground">
              <Cpu size={16} className="animate-pulse text-primary" />
              <span className="font-mono text-sm">Loading network data…</span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
