type Props = {
  score: number;
  band: string;
};

function meterColor(score: number) {
  if (score >= 70) return "bg-red-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-emerald-500";
}

export function RiskMeter({ score, band }: Props) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-4">
      <p className="text-sm text-ink/60">Warranty Risk Score</p>
      <div className="mt-2 h-3 w-full rounded-full bg-ink/10">
        <div className={`h-3 rounded-full ${meterColor(score)}`} style={{ width: `${Math.min(100, score)}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xl font-bold">{score}/100</span>
        <span className="rounded-full bg-ink/10 px-3 py-1 text-sm">{band}</span>
      </div>
    </div>
  );
}
