import { Server, Activity, Box, Users } from 'lucide-react';
import type { NetworkStats } from '@/lib/engines/networkEngine';

interface Props {
  stats: NetworkStats;
}

function HealthBadge({ health }: { health: NetworkStats['networkHealth'] }) {
  const config = {
    excellent: 'badge-pump',
    good: 'badge-neutral',
    degraded: 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/30',
    down: 'badge-dump',
  };
  return (
    <span className={`${config[health]} text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider`}>
      {health}
    </span>
  );
}

function TpsGauge({ tps, max }: { tps: number; max: number }) {
  const pct = Math.min(100, (tps / max) * 100);
  const color =
    pct > 50
      ? 'hsl(158 60% 44%)'
      : pct > 20
      ? 'hsl(43 90% 50%)'
      : 'hsl(0 68% 52%)';
  // Logarithmic scale so small differences at high TPS are still visible
  const displayPct = Math.min(
    100,
    (Math.log10(tps + 1) / Math.log10(max + 1)) * 100,
  );
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-baseline">
        <span className="font-mono font-bold text-xl" style={{ color }}>
          {tps.toLocaleString()}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          / {max.toLocaleString()} max TPS
        </span>
      </div>
      <div className="h-2 rounded-full bg-border/50 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${displayPct}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function NetworkPanel({ stats }: Props) {
  return (
    <div className="panel flex flex-col h-full">
      <div className="panel-header">
        <span className="flex items-center gap-1.5">
          <Server size={12} className="text-primary" />
          Solana Network
        </span>
        <HealthBadge health={stats.networkHealth} />
      </div>

      <div className="panel-body flex-1 overflow-y-auto space-y-3">
        {/* TPS Gauge */}
        <div className="rounded-lg border border-border/60 bg-secondary/30 p-3">
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
            <Activity size={10} /> Live TPS
          </div>
          <TpsGauge tps={stats.tps} max={stats.tpsMax} />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: 'Slot', value: stats.currentSlot.toLocaleString() },
            { label: 'Epoch', value: `${stats.epoch}` },
            { label: 'Block Time', value: `${stats.blockTime}ms` },
            { label: 'Validators', value: stats.validatorCount.toLocaleString() },
            { label: 'Staked', value: `${(stats.stakeSOL / 1e6).toFixed(1)}M` },
            { label: 'Inflation', value: `${stats.inflationRate}%` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-md border border-border/50 bg-secondary/20 px-2 py-1.5"
            >
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                {label}
              </div>
              <div className="font-mono font-bold text-xs text-foreground">
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Epoch progress */}
        <div className="rounded-lg border border-border/60 bg-secondary/30 p-2.5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Epoch {stats.epoch} Progress
            </span>
            <span className="font-mono text-[11px] text-primary">
              {stats.epochProgress.toFixed(1)}%
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-border/50 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${stats.epochProgress}%`,
                background:
                  'linear-gradient(90deg, hsl(158 60% 36%), hsl(168 65% 48%))',
              }}
            />
          </div>
        </div>

        {/* Top Validators */}
        <div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
            <Users size={9} /> Top Validators
          </div>
          <div className="space-y-1">
            {stats.topValidators.slice(0, 4).map((v) => (
              <div
                key={v.name}
                className="flex items-center gap-2 px-2 py-1 rounded bg-secondary/20 border border-border/40"
              >
                <span className="font-mono text-[11px] text-foreground flex-1 truncate">
                  {v.name}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {(v.stake / 1e6).toFixed(1)}M
                </span>
                <span className="font-mono text-[10px] text-chart-2">
                  {v.commission}%
                </span>
                <span
                  className={`font-mono text-[10px] ${
                    v.skipRate < 0.15 ? 'text-chart-1' : 'text-chart-3'
                  }`}
                >
                  {(v.skipRate * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Blocks */}
        <div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground mb-1.5 flex items-center gap-1">
            <Box size={9} /> Recent Blocks
          </div>
          <div className="space-y-0.5">
            {stats.recentBlocks.slice(0, 5).map((b) => (
              <div
                key={b.slot}
                className="flex items-center gap-2 text-[10px] font-mono px-1 py-0.5"
              >
                <span className="text-primary">{b.slot.toLocaleString()}</span>
                <span className="text-chart-2">{b.txCount.toLocaleString()} tx</span>
                <span className="text-muted-foreground">{b.time}ms</span>
                <span className="text-muted-foreground flex-1 text-right truncate">
                  {b.leader}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
