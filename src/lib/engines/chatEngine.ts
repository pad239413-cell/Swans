import type { TokenPrice } from './priceEngine';
import type { StockgeistSignal, MarketSentiment } from './stockgeist';
import type { SocialMetric } from './lunarcrush';
import type { MEVBundle, JitoStats } from './mevEngine';
import type { AgentAction, AgentStatus } from './agentEngine';
import type { NetworkStats } from './networkEngine';
import { getNetworkSummary } from './networkEngine';

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: number;
  tags?: string[];
}

// ─── Context stores ──────────────────────────────────────────────────────────
let priceData: Record<string, TokenPrice> = {};
let sentimentData: StockgeistSignal[] = [];
let socialData: SocialMetric[] = [];
let marketData: MarketSentiment | null = null;
let mevData: { bundles: MEVBundle[]; stats: JitoStats } | null = null;
let agentData: { actions: AgentAction[]; status: AgentStatus } | null = null;
let networkData: NetworkStats | null = null;

export function updateChatContext(
  prices: Record<string, TokenPrice>,
  signals: StockgeistSignal[],
  social: SocialMetric[],
  market: MarketSentiment,
  mev?: { bundles: MEVBundle[]; stats: JitoStats },
  agent?: { actions: AgentAction[]; status: AgentStatus },
  network?: NetworkStats
) {
  priceData = prices;
  sentimentData = signals;
  socialData = social;
  marketData = market;
  if (mev) mevData = mev;
  if (agent) agentData = agent;
  if (network) networkData = network;
}

// ─── Formatters ──────────────────────────────────────────────────────────────
function fmtPrice(p: number): string {
  if (p < 0.000001) return `$${p.toFixed(10)}`;
  if (p < 0.0001)   return `$${p.toFixed(8)}`;
  if (p < 0.01)     return `$${p.toFixed(6)}`;
  if (p < 1)        return `$${p.toFixed(4)}`;
  return `$${p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtLarge(n: number): string {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3)  return `$${(n / 1e3).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}

function fmtPct(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

function fmtConf(c: number): string {
  if (c >= 85) return `🔥 ${c}% (VERY HIGH)`;
  if (c >= 70) return `✅ ${c}% (HIGH)`;
  if (c >= 55) return `🟡 ${c}% (MEDIUM)`;
  return `⚪ ${c}% (LOW)`;
}

// ─── Token resolution ─────────────────────────────────────────────────────────
const ALL_TOKENS = ['SOL', 'JUP', 'BONK', 'WIF', 'JTO', 'PYTH', 'RNDR', 'MEME', 'RAY', 'MNGO'];

function findToken(input: string): string | null {
  const upper = input.toUpperCase();
  return ALL_TOKENS.find(t => new RegExp(`\\b${t}\\b`).test(upper))
    ?? ALL_TOKENS.find(t => upper.includes(t))
    ?? null;
}

// ─── Signal helpers ───────────────────────────────────────────────────────────
function signalEmoji(signal: TokenPrice['signal']): string {
  return { pump: '🚀', dump: '📉', accumulate: '🔍', neutral: '➡️' }[signal];
}

function signalColor(signal: TokenPrice['signal']): string {
  return { pump: 'BULLISH', dump: 'BEARISH', accumulate: 'ACCUMULATING', neutral: 'NEUTRAL' }[signal];
}

function predEmoji(pred: StockgeistSignal['prediction']): string {
  const map: Record<string, string> = {
    strong_buy: '💚', buy: '🟢', neutral: '⚪', sell: '🔴', strong_sell: '🚨',
  };
  return map[pred] ?? '⚪';
}

function healthEmoji(tps: number): string {
  if (tps > 3500) return '💚 EXCELLENT';
  if (tps > 2500) return '🟡 GOOD';
  if (tps > 1000) return '🟠 DEGRADED';
  return '🔴 DOWN';
}

// ─── PUMP/DUMP Analysis ───────────────────────────────────────────────────────
function getPumpDumpAnalysis(token: string): string {
  const price = priceData[token];
  const signal = sentimentData.find(s => s.symbol === token);
  const social = socialData.find(s => s.symbol === token);

  if (!price) {
    return `⏳ No data available for **${token}** yet — engines are still warming up. Try again in a moment.`;
  }

  const parts: string[] = [];
  const sig = signalEmoji(price.signal);

  parts.push(`**${token} Pump/Dump Analysis** ${sig}`);
  parts.push(`Price: **${fmtPrice(price.price)}** (${fmtPct(price.change24h)} 24h)`);
  parts.push(`Signal: **${signalColor(price.signal)}** | Confidence: ${fmtConf(price.confidence)}`);
  parts.push(`Volume 24h: ${fmtLarge(price.volume24h)} | MCap: ${fmtLarge(price.marketCap)}`);

  if (signal) {
    const pred = signal.prediction.replace(/_/g, ' ').toUpperCase();
    const pe = predEmoji(signal.prediction);
    parts.push('');
    parts.push(`**AI Prediction** ${pe}`);
    parts.push(`Verdict: **${pred}** | Target: **${fmtPrice(signal.priceTarget)}** | Conf: ${signal.confidence}%`);
    parts.push(`Bull/Bear: ${(signal.bullishRatio * 100).toFixed(1)}% bulls / ${(signal.bearishRatio * 100).toFixed(1)}% bears`);
    parts.push(`Fear & Greed: **${signal.fearGreedIndex}/100** | Sentiment: ${(signal.sentimentScore * 100).toFixed(0)}/100`);
    parts.push(`📰 ${signal.newsCount.toLocaleString()} articles | 𝕏 ${(signal.twitterMentions / 1000).toFixed(0)}K tweets`);
    parts.push(`💡 *${signal.keyInsight}*`);
  }

  if (social) {
    const trendStr = social.trend === 'rising' ? '📈 Rising' : social.trend === 'falling' ? '📉 Falling' : '📊 Stable';
    parts.push('');
    parts.push(`**Social Intelligence** (LunarCrush)`);
    parts.push(`Galaxy Score: **${social.galaxyScore}/100** | AltRank: **#${social.altRank}** | ${trendStr}`);
    parts.push(`Mentions 24h: **${(social.mentions24h / 1000).toFixed(0)}K** | Sentiment: ${social.sentiment}/100`);
    parts.push(`Price Correlation: ${(social.priceCorrelation * 100).toFixed(0)}%`);
  }

  parts.push('');
  const isStrong = price.confidence > 70;
  const isMedium = price.confidence > 55;

  if (price.signal === 'pump' && isStrong) {
    parts.push(`⚡ **VERDICT: STRONG PUMP SIGNAL**`);
    parts.push(`Momentum accelerating — consider scaling in with defined risk. Stop-loss below recent support. Target: ${signal ? fmtPrice(signal.priceTarget) : 'N/A'}.`);
  } else if (price.signal === 'pump' && isMedium) {
    parts.push(`📈 **VERDICT: MODERATE PUMP SIGNAL**`);
    parts.push(`Bullish pressure building but not yet confirmed. Watch for volume confirmation — consider small starter position.`);
  } else if (price.signal === 'dump' && isStrong) {
    parts.push(`⚠️ **VERDICT: STRONG DUMP SIGNAL**`);
    parts.push(`Significant bearish pressure detected. Reduce exposure or set protective stops. Avoid catching falling knives.`);
  } else if (price.signal === 'dump' && isMedium) {
    parts.push(`📉 **VERDICT: MODERATE DUMP SIGNAL**`);
    parts.push(`Selling pressure emerging. Monitor support levels. Consider taking partial profits if in profit.`);
  } else if (price.signal === 'accumulate') {
    parts.push(`💎 **VERDICT: ACCUMULATION ZONE DETECTED**`);
    parts.push(`Smart money quietly loading. Low volatility + high on-chain flow = coiled spring. Delayed breakout potential.`);
  } else {
    parts.push(`📊 **VERDICT: NEUTRAL — NO CLEAR EDGE**`);
    parts.push(`Mixed signals. Wait for directional confirmation before entering new positions. Preserve capital.`);
  }

  return parts.join('\n');
}

// ─── Market overview ──────────────────────────────────────────────────────────
function getMarketOverview(): string {
  if (!marketData) return '⏳ Market data loading... Please wait a moment.';

  const label = marketData.overall.replace(/_/g, ' ').toUpperCase();
  const idx = marketData.index;
  const emoji = idx >= 80 ? '🤑' : idx >= 60 ? '😊' : idx >= 40 ? '😐' : idx >= 20 ? '😰' : '😱';

  const allTokens = Object.values(priceData);
  const topPump  = [...allTokens].filter(t => t.signal === 'pump').sort((a, b) => b.confidence - a.confidence)[0];
  const topDump  = [...allTokens].filter(t => t.signal === 'dump').sort((a, b) => b.confidence - a.confidence)[0];
  const topAccum = [...allTokens].filter(t => t.signal === 'accumulate').sort((a, b) => b.confidence - a.confidence)[0];

  const gainers = [...allTokens].sort((a, b) => b.change24h - a.change24h).slice(0, 3);
  const losers  = [...allTokens].sort((a, b) => a.change24h - b.change24h).slice(0, 3);

  const lines = [
    `**Solana Market Overview** ${emoji}`,
    `Fear & Greed Index: **${idx}/100** — ${label}`,
    `Solana TVL: **${fmtLarge(marketData.solanaTVL)}** | DeFi Volume: **${fmtLarge(marketData.defiVolume)}**`,
    '',
    `**Signal Board:**`,
  ];

  if (topPump)  lines.push(`🚀 Top PUMP: **${topPump.symbol}** @ ${fmtPrice(topPump.price)} (conf: ${topPump.confidence}%)`);
  if (topDump)  lines.push(`📉 Top DUMP: **${topDump.symbol}** @ ${fmtPrice(topDump.price)} (conf: ${topDump.confidence}%)`);
  if (topAccum) lines.push(`🔍 Accumulating: **${topAccum.symbol}** @ ${fmtPrice(topAccum.price)}`);

  if (gainers.length) {
    lines.push('');
    lines.push(`**Top Gainers 24h:** ${gainers.map(t => `${t.symbol} ${fmtPct(t.change24h)}`).join(' · ')}`);
  }
  if (losers.length) {
    lines.push(`**Top Losers 24h:** ${losers.map(t => `${t.symbol} ${fmtPct(t.change24h)}`).join(' · ')}`);
  }

  lines.push('');
  lines.push(`**AI Narrative:** *${marketData.aiNarrative}*`);

  return lines.join('\n');
}

// ─── Price analysis ───────────────────────────────────────────────────────────
function getPriceAnalysis(token: string): string {
  const price = priceData[token];
  if (!price) {
    return `**${token}** is not in my tracked universe.\n\nTracked tokens: ${ALL_TOKENS.join(', ')}.\n\nType **"all prices"** to see the full board.`;
  }

  const change = price.change24h;
  const emoji  = change > 10 ? '🚀' : change > 3 ? '📈' : change > 0 ? '🟢' : change > -3 ? '🟡' : change > -10 ? '📉' : '💥';
  const signal = sentimentData.find(s => s.symbol === token);

  const lines = [
    `**${token} — ${price.name}** ${emoji}`,
    `Price: **${fmtPrice(price.price)}**`,
    `24h Change: **${fmtPct(change)}**`,
    `Volume 24h: ${fmtLarge(price.volume24h)}`,
    `Market Cap: ${fmtLarge(price.marketCap)}`,
    `Signal: **${signalColor(price.signal)}** | Confidence: ${fmtConf(price.confidence)}`,
  ];

  if (signal) {
    const pe = predEmoji(signal.prediction);
    lines.push(`AI Prediction: ${pe} **${signal.prediction.replace(/_/g, ' ').toUpperCase()}** | Target: ${fmtPrice(signal.priceTarget)}`);
  }

  lines.push(`Updated: ${new Date(price.lastUpdated).toLocaleTimeString()}`);
  return lines.join('\n');
}

// ─── All prices board ─────────────────────────────────────────────────────────
function getAllPrices(): string {
  const tokens = Object.values(priceData);
  if (tokens.length === 0) return '⏳ Price data loading...';

  const sorted = [...tokens].sort((a, b) => b.change24h - a.change24h);
  const lines  = ['**Live Token Prices** 📊', ''];

  sorted.forEach(t => {
    const arrow = t.change24h >= 0 ? '▲' : '▼';
    lines.push(
      `${t.symbol.padEnd(5)} ${fmtPrice(t.price).padStart(14)}  ${arrow} ${fmtPct(t.change24h).padStart(8)}  ${signalEmoji(t.signal)} ${t.signal.toUpperCase()} (${t.confidence}%)`
    );
  });

  lines.push('');
  lines.push(`Tracked: ${tokens.length} tokens | Refresh: every 3s`);
  return lines.join('\n');
}

// ─── Top movers ───────────────────────────────────────────────────────────────
function getTopMovers(): string {
  const tokens = Object.values(priceData);
  if (tokens.length === 0) return '⏳ Price data loading...';

  const gainers    = [...tokens].sort((a, b) => b.change24h - a.change24h).slice(0, 5);
  const losers     = [...tokens].sort((a, b) => a.change24h - b.change24h).slice(0, 5);
  const mostActive = [...tokens].sort((a, b) => b.volume24h - a.volume24h)[0];

  const lines = ['**Top Movers — Last 24h** 📊', ''];
  lines.push('🏆 **Biggest Gainers:**');
  gainers.forEach((t, i) => {
    lines.push(`  ${i + 1}. ${t.symbol} — ${fmtPrice(t.price)} **${fmtPct(t.change24h)}** ${signalEmoji(t.signal)}`);
  });

  lines.push('');
  lines.push('💥 **Biggest Losers:**');
  losers.forEach((t, i) => {
    lines.push(`  ${i + 1}. ${t.symbol} — ${fmtPrice(t.price)} **${fmtPct(t.change24h)}** ${signalEmoji(t.signal)}`);
  });

  if (mostActive) {
    lines.push('');
    lines.push(`💧 **Most Active by Volume:** ${mostActive.symbol} — ${fmtLarge(mostActive.volume24h)}`);
  }

  return lines.join('\n');
}

// ─── Social intelligence ──────────────────────────────────────────────────────
function getSocialAnalysis(token: string): string {
  const social = socialData.find(s => s.symbol === token);
  const price  = priceData[token];

  if (!social) {
    return `📭 No social data for **${token}** yet.\nAvailable: ${socialData.map(s => s.symbol).join(', ')}.`;
  }

  const trendEmoji = social.trend === 'rising' ? '📈' : social.trend === 'falling' ? '📉' : '📊';
  const sentiment  = social.sentiment > 70 ? '🟢 Bullish' : social.sentiment > 40 ? '🟡 Neutral' : '🔴 Bearish';

  const lines = [
    `**${token} Social Intelligence** ${trendEmoji}`,
    `Source: LunarCrush | ${social.name}`,
    '',
    `**Galaxy Score:** **${social.galaxyScore}/100** | **AltRank:** **#${social.altRank}**`,
    `Lunar Score: ${social.lunarScore} | Influencer Score: ${social.influencerScore}`,
    '',
    `**Social Activity:**`,
    `Volume: **${(social.socialVolume / 1000).toFixed(0)}K** | Engagement: ${(social.socialEngagement / 1e6).toFixed(1)}M`,
    `24h Mentions: **${(social.mentions24h / 1000).toFixed(0)}K** (Twitter + Reddit + Discord)`,
    `Sentiment: ${sentiment} (${social.sentiment}/100) | Trend: **${social.trend.toUpperCase()}**`,
    `Price Correlation: **${(social.priceCorrelation * 100).toFixed(0)}%**`,
  ];

  if (price) {
    lines.push('');
    lines.push(`**Price Context:**`);
    lines.push(`${fmtPrice(price.price)} | ${fmtPct(price.change24h)} 24h | Signal: **${signalColor(price.signal)}**`);
  }

  lines.push('');
  if (social.galaxyScore > 80 && social.trend === 'rising') {
    lines.push(`🔥 **High conviction + rising trend** — retail FOMO potential. Watch for price follow-through.`);
  } else if (social.altRank < 10 && social.sentiment > 65) {
    lines.push(`💡 **Top AltRank + positive sentiment** — strong community tailwind.`);
  } else if (social.trend === 'falling' && social.sentiment < 45) {
    lines.push(`⚠️ **Declining interest + bearish sentiment** — losing narrative momentum. Caution advised.`);
  } else {
    lines.push(`📊 Social metrics within normal range. No extreme signals.`);
  }

  return lines.join('\n');
}

// ─── MEV / Jito ───────────────────────────────────────────────────────────────
function getMevSummary(): string {
  if (!mevData) return '⏳ MEV data loading...';
  const { stats, bundles } = mevData;

  const confirmed    = bundles.filter(b => b.status === 'confirmed');
  const failed       = bundles.filter(b => b.status === 'failed');
  const pending      = bundles.filter(b => b.status === 'pending' || b.status === 'submitted');
  const recentProfit = confirmed.slice(0, 10).reduce((s, b) => s + b.profit, 0);
  const topBundle    = [...confirmed].sort((a, b) => b.profit - a.profit)[0];

  const typeBreakdown = ['arbitrage', 'sandwich', 'liquidation', 'frontrun']
    .map(type => `${type}: ${bundles.filter(b => b.type === type).length}`)
    .join(' | ');

  return [
    `**Jito MEV Dashboard** ⚡`,
    '',
    `**Throughput:**`,
    `Submitted: **${stats.bundlesSubmitted.toLocaleString()}** | Landed: **${stats.bundlesLanded.toLocaleString()}**`,
    `Success Rate: **${stats.successRate}%** | Network TPS: **${stats.tps.toLocaleString()}**`,
    `Current Slot: **${stats.currentSlot.toLocaleString()}**`,
    '',
    `**Profitability:**`,
    `Total Profit: **${stats.totalProfitSOL.toFixed(4)} SOL** | Avg Tip: ${stats.avgTipSOL.toFixed(5)} SOL`,
    `Last 10 Confirmed: **+${recentProfit.toFixed(4)} SOL**`,
    topBundle ? `Best Bundle: **+${topBundle.profit.toFixed(4)} SOL** (${topBundle.type})` : '',
    '',
    `**Live Queue (${bundles.length} bundles):**`,
    `✅ Confirmed: ${confirmed.length} | ⏳ Pending: ${pending.length} | ❌ Failed: ${failed.length}`,
    `Types: ${typeBreakdown}`,
  ].filter(Boolean).join('\n');
}

// ─── Agent status ─────────────────────────────────────────────────────────────
function getAgentStatus(): string {
  if (!agentData) return '⏳ Agent data loading...';
  const { status, actions } = agentData;

  const confirmed    = actions.filter(a => a.status === 'confirmed');
  const wins         = confirmed.filter(a => (a.profit ?? 0) > 0).length;
  const totalProfit  = confirmed.reduce((s, a) => s + (a.profit ?? 0), 0);
  const recentAction = actions[0];
  const pnlSign      = status.totalPnL >= 0 ? '+' : '';

  const typeCount: Record<string, number> = {};
  actions.slice(0, 20).forEach(a => { typeCount[a.type] = (typeCount[a.type] ?? 0) + 1; });
  const topTypes = Object.entries(typeCount).sort((a, b) => b[1] - a[1]).slice(0, 3)
    .map(([t, c]) => `${t}: ${c}`).join(' | ');

  return [
    `**Autonomous Agent** 🤖`,
    `Mode: **${status.mode.toUpperCase()}** | Status: ${status.isActive ? '✅ ACTIVE' : '❌ PAUSED'}`,
    '',
    `**Portfolio:**`,
    `Value: **$${status.portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}**`,
    `Total PnL: **${pnlSign}$${status.totalPnL.toFixed(2)}** (${pnlSign}${status.pnlPercent.toFixed(1)}%)`,
    '',
    `**Performance:**`,
    `Win Rate: **${status.winRate}%** | Actions Today: **${status.actionsToday}**`,
    `Confirmed: ${confirmed.length} | Wins: ${wins} | Profit: ${totalProfit >= 0 ? '+' : ''}$${totalProfit.toFixed(2)}`,
    `Risk Score: **${status.riskScore}/100** ${status.riskScore > 70 ? '🔴 HIGH' : status.riskScore > 40 ? '🟡 MED' : '🟢 LOW'}`,
    `Top Action Types: ${topTypes}`,
    '',
    `**Current State:**`,
    `🔍 ${status.currentTask}`,
    `⏭️ Next: ${status.nextAction}`,
    recentAction ? `📋 Last: ${recentAction.description} (${recentAction.status})` : '',
  ].filter(Boolean).join('\n');
}

// ─── Compare tokens ───────────────────────────────────────────────────────────
function compareTokens(tokens: string[]): string {
  const found = tokens.filter(t => priceData[t]);
  if (found.length < 2) {
    return `I need at least 2 known tokens to compare. Try: "compare SOL and WIF" or "SOL vs BONK".`;
  }

  const lines = [`**Token Comparison** ⚖️`, ''];

  const rows: string[][] = [
    ['Price',   ...found.map(t => fmtPrice(priceData[t].price))],
    ['24h Chg', ...found.map(t => fmtPct(priceData[t].change24h))],
    ['Signal',  ...found.map(t => signalColor(priceData[t].signal))],
    ['Conf',    ...found.map(t => `${priceData[t].confidence}%`)],
    ['MCap',    ...found.map(t => fmtLarge(priceData[t].marketCap))],
    ['Volume',  ...found.map(t => fmtLarge(priceData[t].volume24h))],
  ];

  const socialRows = found.map(t => socialData.find(s => s.symbol === t));
  if (socialRows.some(Boolean)) {
    rows.push(['Galaxy',  ...found.map((_, i) => socialRows[i] ? `${socialRows[i]!.galaxyScore}/100` : 'N/A')]);
    rows.push(['AltRank', ...found.map((_, i) => socialRows[i] ? `#${socialRows[i]!.altRank}` : 'N/A')]);
  }

  rows.forEach(row => {
    lines.push(`**${row[0]}:** ${row.slice(1).map((v, i) => `${found[i]}: ${v}`).join(' | ')}`);
  });

  const winner = found.reduce((best, t) => {
    if (!best) return t;
    const score = (sym: string) => priceData[sym].confidence * (priceData[sym].signal === 'pump' ? 1 : priceData[sym].signal === 'dump' ? -1 : 0);
    return score(t) > score(best) ? t : best;
  }, '');

  lines.push('');
  lines.push(`🏆 **Stronger signal:** ${winner} (${signalColor(priceData[winner].signal)} @ ${priceData[winner].confidence}% conf)`);

  return lines.join('\n');
}

// ─── Strategies ───────────────────────────────────────────────────────────────
const STRATEGIES: Record<string, string> = {
  default: `**DeFi Yield Strategy** 💰\n\n**Allocation:**\n• 40% SOL — Jito liquid staking (~7.8% APY)\n• 30% Jupiter LP pools (SOL/USDC) — fees + rewards\n• 20% liquid USDC — opportunistic swaps\n• 10% meme exposure (BONK, WIF) — asymmetric upside\n\n**Risk:** Medium | **Target:** 12–18% APY\n**Rebalance:** Weekly`,

  meme: `**Meme Season Strategy** 🎰\n\n**Playbook:**\n• Tokens: BONK, WIF, MEME — watch RAY/MNGO for breakouts\n• Entry trigger: Galaxy Score > 80 AND AltRank rising\n• Position size: 2–5% per token (never >15% total)\n• Stop loss: **–25% from entry** (hard rule)\n• Take profit: +50% → sell 1/3 | +100% → sell 1/3 | let rest run\n\n**Risk:** HIGH | Only play with money you can lose 100%\n**Edge:** Social velocity leads price by ~2–6 hours`,

  conservative: `**Conservative Yield** 🔒\n\n**Allocation:**\n• 70% liquid staking (mSOL / JitoSOL) — 7–8% APY\n• 20% stablecoin yield (USDC on Kamino) — 8–12% APY\n• 10% USDC cash buffer — emergency liquidity\n\n**Risk:** LOW | **Target:** 8–12% APY\n**Max drawdown:** ~3–5% (staking slashing risk only)\n**Rebalance:** Monthly`,

  aggressive: `**Aggressive Alpha** ⚡\n\n**Playbook:**\n• MEV via Jito bundles — sandwich + arb opportunities\n• Snipe new token launches with 1–3% portfolio\n• Copy-trade whale wallets on-chain (Nansen/Birdeye)\n• Leverage sentiment spikes for 2–5x meme plays\n• Delta-neutral yield on perp DEXs (Drift, Zeta)\n\n**Risk:** VERY HIGH | Max 10% of total portfolio\n**Targets:** 50–300% on alpha trades, 15–25% APY base\n**Stop:** Cut positions at –30% from peak NAV`,

  ray: `**Raydium (RAY) Strategy** 💧\n\n**Why RAY:**\n• Core DEX infrastructure — revenue tied to Solana volume\n• AMM LP positions earn swap fees + RAY emissions\n• Liquidity mining on stable pairs: low IL risk\n\n**Play:**\n• Provide liquidity to RAY/USDC or RAY/SOL pool\n• Compound RAY rewards weekly\n• Watch for RAY buyback/burn events\n\n**Risk:** Medium | **Yield:** 15–35% APY on active pairs`,

  network: `**Network-Aware Strategy** 🌐\n\n**Signals to watch:**\n• TPS > 3500 → favorable for high-frequency trading\n• Epoch transitions → validator rotation, potential slippage\n• High validator skip rates → avoid complex bundles\n\n**Tactics:**\n• Execute large swaps during low-congestion windows\n• Use Jito bundles when TPS > 3000 for MEV protection\n• Monitor validator leader schedule for optimal tx timing`,
};

function getStrategyAdvice(input: string): string {
  if (input.includes('meme') || input.includes('degen') || input.includes('bonk') || input.includes('wif')) return STRATEGIES.meme;
  if (input.includes('conservative') || input.includes('safe') || input.includes('low risk')) return STRATEGIES.conservative;
  if (input.includes('aggressive') || input.includes('alpha') || input.includes('high risk')) return STRATEGIES.aggressive;
  if (input.includes('ray') || input.includes('raydium') || input.includes('amm') || input.includes('lp')) return STRATEGIES.ray;
  if (input.includes('network') || input.includes('congestion')) return STRATEGIES.network;
  return STRATEGIES.default;
}

// ─── System status ────────────────────────────────────────────────────────────
function getSystemStatus(): string {
  const tokenCount  = Object.keys(priceData).length;
  const signalCount = sentimentData.length;
  const socialCount = socialData.length;
  const tps         = networkData?.tps ?? 0;
  const slot        = networkData?.currentSlot ?? 0;
  const netStatus   = tps > 0 ? healthEmoji(tps) : '⏳ loading';

  return [
    `**SwanAI System Status** ✅`,
    '',
    `**Engine Health:**`,
    `• Price Engine: **${tokenCount}/${ALL_TOKENS.length}** tokens tracked | 3s refresh`,
    `• Sentiment Engine: **${signalCount}** signals active | 10s refresh`,
    `• Social Feed: **${socialCount}** streams | 8s refresh`,
    `• MEV Engine: **${mevData ? `${mevData.bundles.length} bundles` : '⏳ loading'}** | 4-8s refresh`,
    `• Agent: **${agentData?.status.isActive ? '🟢 ACTIVE' : '⏳ loading'}** | mode: ${agentData?.status.mode ?? 'N/A'}`,
    `• Network: **${netStatus}** | TPS: ${tps > 0 ? tps.toLocaleString() : 'loading'} | Slot: ${slot > 0 ? slot.toLocaleString() : 'loading'}`,
    '',
    `**Data Sources:**`,
    `Solana RPC + Jito Relayer + LunarCrush + StockGeist AI`,
    `All data simulated in real-time — no API keys required`,
    '',
    `**Tracked Tokens:** ${ALL_TOKENS.join(', ')}`,
  ].join('\n');
}

// ─── Help ─────────────────────────────────────────────────────────────────────
const HELP_TEXT = `**SwanAI Commands** 🦢

**Price & Charts:**
• \`SOL price\` / \`WIF price\` — real-time price + signal
• \`all prices\` / \`top movers\` — full price board & movers
• \`SOL vs WIF\` / \`compare BONK and JUP\` — side-by-side comparison

**Pump/Dump Analysis:**
• \`SOL pump?\` / \`BONK dump?\` — full pump/dump breakdown
• \`predict WIF\` / \`RNDR analysis\` — AI prediction + social intel
• \`RAY signal\` / \`MNGO signal\` — newer token signals

**Social Intelligence:**
• \`SOL social\` / \`BONK lunar\` — LunarCrush social metrics
• \`WIF mentions\` / \`JUP twitter\` — social volume & sentiment

**Market:**
• \`market overview\` / \`sentiment\` — Fear & Greed + narratives
• \`top gainers\` / \`top losers\` — movers

**Agent & MEV:**
• \`agent status\` / \`portfolio\` / \`pnl\` — autonomous agent metrics
• \`mev stats\` / \`jito\` / \`bundles\` — MEV bundle dashboard

**Strategy:**
• \`strategy\` — default DeFi yield plan
• \`meme strategy\` — meme coin playbook
• \`conservative strategy\` — low-risk yield
• \`aggressive strategy\` — alpha hunting
• \`RAY strategy\` — Raydium LP tactics

**System:**
• \`help\` — this menu
• \`status\` — engine health
• \`network\` — Solana network stats (TPS, slots, validators)

**Tracked tokens:** ${ALL_TOKENS.join(', ')}`;

// ─── Greetings ────────────────────────────────────────────────────────────────
const GREETINGS = [
  `Hey! I'm **SwanAI**, your autonomous Solana DeFi co-pilot. 🦢\n\nTracking **${ALL_TOKENS.length} tokens**, monitoring MEV via Jito, social sentiment via LunarCrush, and AI predictions via StockGeist — all in real-time.\n\nTry: \`SOL analysis\`, \`market overview\`, or \`help\` for all commands.`,
  `SwanAI online. 🤖 All engines operational.\n\nI track Solana DeFi in real-time: prices, pump/dump signals, social momentum, MEV bundles, and an autonomous trading agent.\n\nWhat would you like to analyze? Ask about: ${ALL_TOKENS.slice(0, 5).join(', ')}...`,
  `Systems nominal. 💚 Monitoring ${ALL_TOKENS.length} Solana tokens.\n\nQuick commands: \`SOL pump?\`, \`top movers\`, \`market overview\`.\nDeep dives: \`WIF analysis\` or \`BONK social\`.`,
];

let greetIdx = 0;

// ─── Main response generator ──────────────────────────────────────────────────
export function generateResponse(userInput: string): string {
  const input = userInput.toLowerCase().trim();
  const token = findToken(input);

  // ── Greetings ──────────────────────────────────────────────────────────────
  if (/^(hi|hello|hey|sup|yo|gm|good morning|greetings)/.test(input)) {
    const r = GREETINGS[greetIdx % GREETINGS.length];
    greetIdx++;
    return r;
  }

  // ── Help ───────────────────────────────────────────────────────────────────
  if (input === 'help' || input === '?' || input.includes('what can you') || input.includes('commands')) {
    return HELP_TEXT;
  }

  // ── System status ──────────────────────────────────────────────────────────
  if ((input.includes('status') || input.includes('system') || input.includes('engine') || input.includes('health'))
      && !input.includes('agent') && !token) {
    return getSystemStatus();
  }

  // ── Network stats ──────────────────────────────────────────────────────────
  if (input === 'network' ||
      input.includes('network stats') || input.includes('network status') ||
      input.includes('validator') || input.includes('epoch') ||
      input.includes('block time') || input.includes('inflation rate') ||
      (input.includes('tps') && !input.includes('agent') && !token) ||
      (input.includes('slot') && !token)) {
    if (networkData) return getNetworkSummary(networkData);
    return '⏳ Network engine is still initialising — try again in a moment.';
  }

  // ── All prices ─────────────────────────────────────────────────────────────
  if (input === 'prices' || input.includes('all prices') || input.includes('all tokens') || input.includes('price board')) {
    return getAllPrices();
  }

  // ── Top movers ─────────────────────────────────────────────────────────────
  if (input.includes('top mover') || input.includes('top gainer') || input.includes('top loser') ||
      input.includes('biggest') || input.includes('best performing') || input.includes('worst performing')) {
    return getTopMovers();
  }

  // ── Compare ────────────────────────────────────────────────────────────────
  if (input.includes(' vs ') || input.includes('compare') || input.includes(' versus ')) {
    const foundTokens = ALL_TOKENS.filter(t => input.toUpperCase().includes(t));
    if (foundTokens.length >= 2) return compareTokens(foundTokens.slice(0, 3));
  }

  // ── Market / sentiment overview ────────────────────────────────────────────
  if ((input.includes('market') || input.includes('overview') || input.includes('fear') || input.includes('greed') ||
       input.includes('narrative') || (input.includes('sentiment') && !token)) &&
      !input.includes('mev') && !input.includes('agent')) {
    return getMarketOverview();
  }

  // ── MEV / Jito ─────────────────────────────────────────────────────────────
  if (input.includes('mev') || input.includes('jito') || input.includes('bundle') ||
      input.includes('arbitrage') || input.includes('sandwich') || input.includes('frontrun') ||
      input.includes('liquidation')) {
    return getMevSummary();
  }

  // ── Agent status ───────────────────────────────────────────────────────────
  if (input.includes('agent') || input.includes('portfolio') || input.includes('pnl') ||
      input.includes('win rate') || input.includes('autonomous')) {
    return getAgentStatus();
  }

  // ── Strategy ───────────────────────────────────────────────────────────────
  if (input.includes('strategy') || input.includes('how to') || input.includes('advice') ||
      input.includes('plan') || input.includes('allocat') || input.includes('playbook')) {
    return getStrategyAdvice(input);
  }

  // ── Token-specific queries ─────────────────────────────────────────────────
  if (token) {
    if (input.includes('pump') || input.includes('dump') || input.includes('predict') ||
        input.includes('signal') || input.includes('buy') || input.includes('sell') ||
        input.includes('analysis') || input.includes('analyze') || input.includes('should i') ||
        input.includes('breakout') || input.includes('target') || input.includes('bearish') ||
        input.includes('bullish')) {
      return getPumpDumpAnalysis(token);
    }

    if (input.includes('social') || input.includes('lunar') || input.includes('twitter') ||
        input.includes('reddit') || input.includes('mention') || input.includes('sentiment') ||
        input.includes('galaxy') || input.includes('altrank') || input.includes('community') ||
        input.includes('hype') || input.includes('viral')) {
      return getSocialAnalysis(token);
    }

    return getPriceAnalysis(token);
  }

  // ── Fallback: market overview ──────────────────────────────────────────────
  return getMarketOverview();
}
