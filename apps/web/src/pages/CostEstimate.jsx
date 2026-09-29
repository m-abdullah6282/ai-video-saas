import { useNavigate } from "react-router-dom";
import { loadPlan } from "../lib/planStore";

const money = (v) => (v === undefined || v === null ? "—" : `£${Number(v).toFixed(2)}`);

function Line({ label, value, strong }) {
  return (
    <div className={`flex justify-between text-xs py-1.5 ${strong ? "border-t border-white/10 mt-1 pt-2" : ""}`}>
      <span className={strong ? "font-medium" : "text-white/50"}>{label}</span>
      <span className={strong ? "text-neon-green font-display text-lg" : ""}>{value}</span>
    </div>
  );
}

export default function CostEstimate() {
  const navigate = useNavigate();
  const plan = loadPlan();

  if (!plan?.result) {
    return (
      <div>
        <p className="text-white/50 mb-4">No plan found. Please create a video first.</p>
        <button
          onClick={() => navigate("/create")}
          className="bg-neon-green text-black font-medium px-5 py-2.5 rounded-lg"
        >
          Go to Create Video
        </button>
      </div>
    );
  }

  const { result, answers = {} } = plan;
  const decision = result.provider_decision ?? {};
  const breakdown = decision.breakdown ?? {};
  const cost = result.cost_analysis ?? {};
  const providers = decision.comparison_table ?? [];
  const reusePct = result.reuse_analysis?.reuse_percentage ?? 0;

  const base = Number(cost.base_cost) || 0;
  const final = Number(cost.final_estimated_cost) || 0;
  const optimizedHeight = base > 0 ? Math.max((final / base) * 100, 4) : 4;

  const recommended = decision.recommended_provider;
  const cheapestReason =
    providers.length > 1
      ? `Lowest estimated total cost among ${providers.length} providers compared.`
      : "Only one provider available for comparison.";

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold">Cost Estimation & Provider Recommendation</h1>
      <p className="text-white/40 text-sm mb-6">
        {answers.Sector || "—"} · {answers.Country || "—"} · {answers.Duration || "—"}
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 space-y-4">
          {/* Breakdown */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="text-xs text-white/50 mb-3">Generation Cost Breakdown</div>
            <Line
              label={`Provider Generation (${decision.recommended_provider ?? "—"})`}
              value={money(breakdown.provider_generation_cost)}
            />
            <Line label="Other AI Services" value={money(breakdown.other_ai_cost)} />
            <Line label="Internal Processing" value={money(breakdown.internal_processing_cost)} />
            <Line label="Estimated Total Core Costs" value={money(breakdown.total_estimated ?? cost.base_cost)} strong />
            <div className="text-[10px] text-white/30 mt-2">
              Estimates only — not confirmed provider charges.
            </div>
          </div>

          {/* Provider */}
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-white/50">Recommended Provider Platform</div>
              <span className="text-[9px] px-2 py-0.5 rounded bg-neon-green/10 text-neon-green">
                ● ACTIVE — RECOMMENDED
              </span>
            </div>
            <div className="text-lg font-display capitalize mb-1">{recommended ?? "—"}</div>
            <div className="text-xs text-white/50 mb-4">{cheapestReason}</div>

            <table className="w-full text-xs">
              <thead>
                <tr className="text-white/30 text-left">
                  <th className="pb-2">Provider</th>
                  <th className="pb-2 text-right">Estimated Cost</th>
                </tr>
              </thead>
              <tbody>
                {providers.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="py-1 text-white/30">No provider data returned</td>
                  </tr>
                ) : (
                  providers.map((p) => (
                    <tr key={p.provider} className={p.recommended ? "text-neon-green" : "text-white/70"}>
                      <td className="py-1 capitalize">
                        {p.provider} {p.recommended && "(Recommended)"}
                      </td>
                      <td className="py-1 text-right">{money(p.total_cost)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="text-[10px] text-white/30 mt-3">
              Quality, speed, language and availability comparison — not available yet (pending real provider integration).
            </div>
          </div>
        </div>

        {/* Savings */}
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
            <div className="text-xs text-white/50 mb-3">RAG Library Optimization Savings</div>
            <Line label="Estimated cost without reuse" value={money(cost.base_cost)} />
            <Line label="Optimized cost (with reuse)" value={money(cost.final_estimated_cost)} />
            <Line
              label="Estimated Saving"
              value={`${money(cost.saving)} (${cost.saving_percentage ?? "—"}%)`}
              strong
            />

            <div className="text-[10px] text-white/40 mt-4 mb-2">Savings Visualization (Cost Comparison)</div>
            <div className="flex items-end justify-center gap-8 h-32">
              <div className="flex flex-col items-center justify-end h-full">
                <div className="w-10 bg-red-500 rounded-t" style={{ height: "100%" }} />
                <span className="text-[9px] text-white/40 mt-1">{money(cost.base_cost)}</span>
              </div>
              <div className="flex flex-col items-center justify-end h-full">
                <div className="w-10 bg-neon-green rounded-t" style={{ height: `${optimizedHeight}%` }} />
                <span className="text-[9px] text-white/40 mt-1">{money(cost.final_estimated_cost)}</span>
              </div>
            </div>
            <div className="text-[10px] text-white/30 mt-3">
              Based on {reusePct}% estimated reuse. Modeled saving, not actual spend.
            </div>
          </div>

          <button
            disabled
            title="Video generation is not implemented yet"
            className="w-full bg-neon-green text-black font-medium py-2.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Approve & Generate Video
          </button>
          <div className="text-[10px] text-white/30 -mt-2 text-center">Generation coming soon</div>
          <button
            onClick={() => navigate("/create")}
            className="w-full border border-white/20 text-white text-sm py-2.5 rounded-lg hover:border-white/40"
          >
            Request Changes
          </button>
          <button
            onClick={() => navigate("/create/plan")}
            className="w-full text-white/40 text-xs hover:text-white/70"
          >
            ← Back to Plan
          </button>
        </div>
      </div>
    </div>
  );
}