export interface NetworkStats {
  tps: number;
  tpsMax: number;
  blockTime: number;           // ms
  currentSlot: number;
  epoch: number;
  epochProgress: number;       // 0–100
  validatorCount: number;
  stakeSOL: number;
  totalSupply: number;
  inflationRate: number;
  networkHealth: 'excellent' | 'good' | 'degraded' | 'down';
  topValidators: ValidatorInfo[];
  recentBlocks: BlockInfo[];
}

export interface ValidatorInfo {
  name: string;
  stake: number;
  commission: number;
  skipRate: number;
}

export interface BlockInfo {
  slot: number;
  time: number;
  txCount: number;
  leader: string;
}

// ─── Static validator set ─────────────────────────────────────────────────────
const BASE_VALIDATORS: ValidatorInfo[] = [
  { name: 'Jito',         stake: 18_420_000, commission: 0, skipRate: 0.12 },
  { name: 'Coinbase',     stake: 12_800_000, commission: 8, skipRate: 0.18 },
  { name: 'Figment',      stake:  9_200_000, commission: 5, skipRate: 0.15 },
  { name: 'Solana Beach', stake:  7_400_000, commission: 0, skipRate: 0.09 },
  { name: 'Everstake',    stake:  6_100_000, commission: 7, skipRate: 0.21 },
  { name: 'P2P Validator',stake:  5_800_000, commission: 5, skipRate: 0.14 },
  { name: 'Chorus One',   stake:  5_200_000, commission: 8, skipRate: 0.17 },
  { name: 'Staking Facilities', stake: 4_700_000, commission: 5, skipRate: 0.13 },
];

// ─── Mutable engine state ─────────────────────────────────────────────────────
let slotBase = 285_412_000 + Math.floor(Math.random() * 10_000);
let epochBase = 662;
let epochProgress = 42.7 + Math.random() * 10;
let currentValidators: ValidatorInfo[] = BASE_VALIDATORS.map(v => ({ ...v }));

function computeHealth(tps: number): NetworkStats['networkHealth'] {
  if (tps > 3500) return 'excellent';
  if (tps > 2500) return 'good';
  if (tps > 800)  return 'degraded';
  return 'down';
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function buildInitialBlocks(): BlockInfo[] {
  return Array.from({ length: 10 }, (_, i) => ({
    slot:     slotBase - i,
    time:     380 + Math.floor(Math.random() * 120),
    txCount:  Math.floor(1800 + Math.random() * 3500),
    leader:   BASE_VALIDATORS[i % BASE_VALIDATORS.length].name,
  }));
}

let recentBlocks: BlockInfo[] = buildInitialBlocks();
let currentStats: NetworkStats = {
  tps:            3_420,
  tpsMax:         65_000,
  blockTime:      420,
  currentSlot:    slotBase,
  epoch:          epochBase,
  epochProgress:  epochProgress,
  validatorCount: 1_872,
  stakeSOL:       398_200_000,
  totalSupply:    575_800_000,
  inflationRate:  5.48,
  networkHealth:  'excellent',
  topValidators:  currentValidators,
  recentBlocks:   recentBlocks,
};

// ─── Engine ───────────────────────────────────────────────────────────────────
export function startNetworkEngine(callback: (stats: NetworkStats) => void): () => void {
  const tick = () => {
    // Advance slot (1–2 slots per tick at ~2s cadence ≈ 400–500ms/slot real)
    const slotAdvance = Math.floor(Math.random() * 2) + 1;
    slotBase += slotAdvance;

    // TPS with occasional dip events (simulates network load variance)
    const tpsBase = 3_100 + Math.random() * 1_100;
    const tpsDip = Math.random() < 0.05; // 5% chance of congestion event
    const newTps = tpsDip ? Math.floor(800 + Math.random() * 1_200) : Math.floor(tpsBase);

    // Block time (ms) inversely correlates with TPS
    const newBlockTime = Math.floor(clamp(500_000 / newTps, 380, 650));

    // Epoch progress advances slowly (432,000 slots per epoch ≈ ~2.2 days)
    epochProgress = epochProgress + 0.003 * slotAdvance;
    if (epochProgress >= 100) {
      epochProgress = 0;
      epochBase++;
    }

    // Update validators with small stake/skipRate drift
    currentValidators = BASE_VALIDATORS.map(v => ({
      ...v,
      stake:    Math.floor(v.stake * (1 + (Math.random() - 0.5) * 0.002)),
      skipRate: parseFloat(
        clamp(v.skipRate + (Math.random() - 0.5) * 0.01, 0.04, 0.55).toFixed(3)
      ),
    })).sort((a, b) => b.stake - a.stake);

    // Push new block to front of recent blocks list
    const newBlock: BlockInfo = {
      slot:    slotBase,
      time:    newBlockTime,
      txCount: Math.floor(1_600 + Math.random() * 3_800),
      leader:  currentValidators[Math.floor(Math.random() * Math.min(4, currentValidators.length))].name,
    };
    recentBlocks = [newBlock, ...recentBlocks.slice(0, 9)];

    // Stake SOL drifts very slowly (validator delegations change)
    const newStake = Math.floor(
      currentStats.stakeSOL * (1 + (Math.random() - 0.5) * 0.0005)
    );

    currentStats = {
      tps:            newTps,
      tpsMax:         65_000,
      blockTime:      newBlockTime,
      currentSlot:    slotBase,
      epoch:          epochBase,
      epochProgress:  parseFloat(Math.min(epochProgress, 99.99).toFixed(3)),
      validatorCount: Math.max(1_800, currentStats.validatorCount + Math.floor((Math.random() - 0.5) * 4)),
      stakeSOL:       newStake,
      totalSupply:    currentStats.totalSupply + Math.floor(Math.random() * 5_000), // inflation
      inflationRate:  parseFloat(
        clamp(currentStats.inflationRate + (Math.random() - 0.5) * 0.02, 4.5, 8.0).toFixed(3)
      ),
      networkHealth:  computeHealth(newTps),
      topValidators:  [...currentValidators],
      recentBlocks:   [...recentBlocks],
    };

    callback({ ...currentStats });
  };

  // Fire immediately, then every 2 seconds
  tick();
  const interval = setInterval(tick, 2_000);
  return () => clearInterval(interval);
}

// ─── Helpers for chat/UI consumers ───────────────────────────────────────────
export function getNetworkSummary(stats: NetworkStats): string {
  const healthIcon = {
    excellent: '💚',
    good:      '🟡',
    degraded:  '🟠',
    down:      '🔴',
  }[stats.networkHealth];

  const stakeRatio = ((stats.stakeSOL / stats.totalSupply) * 100).toFixed(1);

  return [
    `**Solana Network Stats** 🌐`,
    '',
    `**Performance:**`,
    `TPS: **${stats.tps.toLocaleString()}** / ${stats.tpsMax.toLocaleString()} max | Block Time: **${stats.blockTime}ms**`,
    `Health: ${healthIcon} **${stats.networkHealth.toUpperCase()}**`,
    '',
    `**Ledger:**`,
    `Current Slot: **${stats.currentSlot.toLocaleString()}**`,
    `Epoch: **${stats.epoch}** | Progress: **${stats.epochProgress.toFixed(1)}%**`,
    '',
    `**Stake & Supply:**`,
    `Staked: **${(stats.stakeSOL / 1e6).toFixed(1)}M SOL** (${stakeRatio}% of supply)`,
    `Total Supply: ${(stats.totalSupply / 1e6).toFixed(1)}M SOL | Inflation: ${stats.inflationRate}%`,
    `Active Validators: **${stats.validatorCount.toLocaleString()}**`,
    '',
    `**Top Validators:**`,
    ...stats.topValidators.slice(0, 5).map(
      (v, i) => `  ${i + 1}. ${v.name} — ${(v.stake / 1e6).toFixed(1)}M SOL | ${v.commission}% comm | skip ${(v.skipRate * 100).toFixed(1)}%`
    ),
    '',
    `**Recent Blocks:**`,
    ...stats.recentBlocks.slice(0, 4).map(
      b => `  Slot ${b.slot.toLocaleString()} — ${b.txCount.toLocaleString()} txs | ${b.time}ms | Leader: ${b.leader}`
    ),
  ].join('\n');
}
