export interface StockgeistSignal {
  symbol: string;
  sentimentScore: number;
  bullishRatio: number;
  bearishRatio: number;
  newsCount: number;
  redditMentions: number;
  twitterMentions: number;
  fearGreedIndex: number;
  prediction: 'strong_buy' | 'buy' | 'neutral' | 'sell' | 'strong_sell';
  priceTarget: number;
  confidence: number;
  keyInsight: string;
}

export interface MarketSentiment {
  overall: 'extreme_fear' | 'fear' | 'neutral' | 'greed' | 'extreme_greed';
  index: number;
  solanaTVL: number;
  defiVolume: number;
  aiNarrative: string;
}

const INSIGHTS: Record<string, string[]> = {
  SOL:  [
    'Validator count up 3.2% — network health bullish signal',
    'DeFi TVL on Solana crossed $4.8B — institutional inflows detected',
    'SOL perpetuals OI surging 18% on major CEXs',
    'Whale wallets accumulating in $170-$185 range',
    'High-frequency DEX volume spiking — smart money moving',
  ],
  JUP:  [
    'Jupiter daily volume hit $840M — DEX dominance growing',
    'JUP token buy pressure from protocol fees accumulation',
    'New perpetuals product driving 22% user growth',
    'Community governance vote passing bullishly',
    'Major integration announced with leading DeFi protocol',
  ],
  BONK: [
    'BONK meme cycle heating up — social volume +340%',
    'Solana meme season momentum building',
    'Retail FOMO indicators rising sharply',
    'BONK burn rate accelerating — supply shock incoming',
    'NFT marketplace integration boosting utility narrative',
  ],
  WIF:  [
    'WIF maintaining top-3 Solana meme status',
    'Influencer sentiment overwhelmingly bullish on CT',
    'Derivatives funding rate positive — longs dominant',
    'WIF DEX liquidity deepening — reduced slippage',
    'Celebrity mentions causing social spike',
  ],
  JTO:  [
    'Jito MEV profits up 47% — protocol revenue growing',
    'JTO staking APY competitive vs liquid staking alternatives',
    'Institutional staking through Jito accelerating',
    'Network tip revenue all-time high last 7 days',
    'JTO governance proposal to increase tip distribution',
  ],
  PYTH: [
    'Pyth oracle network expanding to 12 new chains',
    'PYTH price feeds adoption up 28% MoM',
    'Institutional DeFi requiring Pyth for compliance',
    'New real-world asset feeds driving token demand',
    'PYTH staking rewards being revised upward',
  ],
};

const AI_NARRATIVES = [
  '🔥 Solana ecosystem showing strong momentum — DeFi activity at cycle highs with DEX volume outpacing Ethereum mainnet for the 3rd consecutive day.',
  '⚡ Smart money detected rotating from L1 blue chips into Solana meme sector — on-chain flow analysis shows $42M inflow in last 4 hours.',
  '📊 Fear & Greed index stabilizing in "Greed" zone — historically precedes 2-3 week bull continuation phase based on Solana-specific data.',
  '🤖 AI trading agents driving 38% of Solana DEX volume — algorithmic liquidity provision creating tighter spreads and deeper order books.',
  '🌊 Macro headwinds dissipating — Fed pivot narrative gaining traction, risk-on assets including Solana outperforming BTC on a risk-adjusted basis.',
  '🔗 Cross-chain bridge inflows to Solana hitting $180M/day — Ethereum DeFi users discovering superior UX and lower fees.',
  '📈 Options market showing bullish skew for SOL — put/call ratio at 0.42, institutional hedging suggests floor formation.',
  '💎 Long-term holder distribution on Solana ecosystem tokens at historical lows — diamond hands dominating the supply.',
];

const BASE_SIGNALS: Record<string, Omit<StockgeistSignal, 'keyInsight'>> = {
  SOL:  { symbol: 'SOL',  sentimentScore: 0.68,  bullishRatio: 0.74, bearishRatio: 0.12, newsCount: 847, redditMentions: 12400, twitterMentions: 284000, fearGreedIndex: 68, prediction: 'buy',        priceTarget: 210,    confidence: 78 },
  JUP:  { symbol: 'JUP',  sentimentScore: 0.54,  bullishRatio: 0.61, bearishRatio: 0.18, newsCount: 234, redditMentions: 3200,  twitterMentions: 48000,  fearGreedIndex: 62, prediction: 'buy',        priceTarget: 1.65,   confidence: 65 },
  BONK: { symbol: 'BONK', sentimentScore: 0.42,  bullishRatio: 0.55, bearishRatio: 0.25, newsCount: 412, redditMentions: 8700,  twitterMentions: 142000, fearGreedIndex: 58, prediction: 'neutral',    priceTarget: 0.000038, confidence: 52 },
  WIF:  { symbol: 'WIF',  sentimentScore: 0.51,  bullishRatio: 0.63, bearishRatio: 0.20, newsCount: 318, redditMentions: 6100,  twitterMentions: 98000,  fearGreedIndex: 64, prediction: 'buy',        priceTarget: 4.20,   confidence: 59 },
  JTO:  { symbol: 'JTO',  sentimentScore: 0.47,  bullishRatio: 0.58, bearishRatio: 0.22, newsCount: 128, redditMentions: 1800,  twitterMentions: 28000,  fearGreedIndex: 55, prediction: 'neutral',    priceTarget: 5.80,   confidence: 56 },
  PYTH: { symbol: 'PYTH', sentimentScore: 0.44,  bullishRatio: 0.56, bearishRatio: 0.23, newsCount: 156, redditMentions: 2100,  twitterMentions: 34000,  fearGreedIndex: 57, prediction: 'neutral',    priceTarget: 0.64,   confidence: 58 },
};

let marketSentiment: MarketSentiment = {
  overall: 'greed',
  index: 68,
  solanaTVL: 4_820_000_000,
  defiVolume: 2_140_000_000,
  aiNarrative: AI_NARRATIVES[0],
};

const current: Record<string, StockgeistSignal> = Object.fromEntries(
  Object.entries(BASE_SIGNALS).map(([k, v]) => [
    k,
    { ...v, keyInsight: INSIGHTS[k][0] },
  ])
);

let narrativeIdx = 0;

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function getPrediction(bull: number, bear: number, score: number): StockgeistSignal['prediction'] {
  if (score > 0.6 && bull > 0.65) return 'strong_buy';
  if (score > 0.4 && bull > 0.55) return 'buy';
  if (score < -0.4 && bear > 0.55) return 'strong_sell';
  if (score < -0.2 && bear > 0.45) return 'sell';
  return 'neutral';
}

function getSentimentLabel(index: number): MarketSentiment['overall'] {
  if (index < 20) return 'extreme_fear';
  if (index < 40) return 'fear';
  if (index < 60) return 'neutral';
  if (index < 80) return 'greed';
  return 'extreme_greed';
}

export function startSentimentEngine(
  callback: (signals: StockgeistSignal[], market: MarketSentiment) => void
): () => void {
  const tick = () => {
    Object.keys(current).forEach((sym) => {
      const s = current[sym];
      const newBull = clamp(s.bullishRatio + (Math.random() - 0.5) * 0.04, 0, 1);
      const newBear = clamp(s.bearishRatio + (Math.random() - 0.5) * 0.03, 0, 1 - newBull);
      const newScore = clamp(s.sentimentScore + (Math.random() - 0.5) * 0.06, -1, 1);
      const fgi = clamp(s.fearGreedIndex + Math.floor((Math.random() - 0.5) * 6), 0, 100);
      const insightList = INSIGHTS[sym] ?? ['Market conditions nominal'];
      const insight = insightList[Math.floor(Math.random() * insightList.length)];

      current[sym] = {
        ...s,
        sentimentScore: parseFloat(newScore.toFixed(3)),
        bullishRatio: parseFloat(newBull.toFixed(3)),
        bearishRatio: parseFloat(newBear.toFixed(3)),
        newsCount: s.newsCount + Math.floor(Math.random() * 5),
        redditMentions: Math.max(100, s.redditMentions + Math.floor((Math.random() - 0.48) * 200)),
        twitterMentions: Math.max(1000, s.twitterMentions + Math.floor((Math.random() - 0.48) * 2000)),
        fearGreedIndex: fgi,
        prediction: getPrediction(newBull, newBear, newScore),
        priceTarget: parseFloat((s.priceTarget * (1 + (Math.random() - 0.5) * 0.02)).toFixed(4)),
        confidence: clamp(s.confidence + Math.floor((Math.random() - 0.5) * 4), 20, 98),
        keyInsight: insight,
      };
    });

    narrativeIdx = (narrativeIdx + 1) % AI_NARRATIVES.length;
    const newIndex = clamp(marketSentiment.index + Math.floor((Math.random() - 0.5) * 4), 0, 100);
    marketSentiment = {
      overall: getSentimentLabel(newIndex),
      index: newIndex,
      solanaTVL: marketSentiment.solanaTVL * (1 + (Math.random() - 0.5) * 0.01),
      defiVolume: marketSentiment.defiVolume * (1 + (Math.random() - 0.5) * 0.02),
      aiNarrative: AI_NARRATIVES[narrativeIdx],
    };

    callback(Object.values(current), { ...marketSentiment });
  };

  tick();
  const interval = setInterval(tick, 10000);
  return () => clearInterval(interval);
}
