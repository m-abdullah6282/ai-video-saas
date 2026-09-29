import { useState } from "react";
import { fetchVideoPlan } from "../lib/api";
import { Home, Sun, Heart, Building2, GraduationCap, Users, User, Flag, Plus } from "lucide-react";

const STEPS = [
  "Sector", "Country", "Audience", "Tone", "Culture",
  "Video Type", "Format", "Duration", "Description",
];

const OPTIONS = {
  Sector: ["Adult Care", "Early Years", "Fostering", "Children's Homes", "Education", "Children's Social Work", "Adult Social Work", "Leaving Care", "Other"],
  Country: ["United Kingdom", "United States", "Australia", "Canada", "UAE", "Saudi Arabia"],
  Audience: ["Employees", "Managers", "Customers", "Learners", "Parents", "Professionals", "General public"],
  Tone: ["Professional", "Friendly", "Reassuring", "Inspirational", "Serious", "Educational", "Conversational", "Energetic", "Corporate", "Emotional"],
  Culture: ["AI Recommended", "Specify manually"],
  "Video Type": ["Training", "Advice", "Marketing", "Help/Support", "Social Media", "Explainer", "Announcement", "Product Demonstration", "Internal Communication"],
  Format: ["16:9", "9:16", "1:1"],
  Duration: ["15 seconds", "30 seconds", "45 seconds", "60 seconds", "90 seconds", "2 minutes", "Custom"],
};

const SECTOR_ICONS = {
  "Adult Care": Home,
  "Early Years": Sun,
  "Fostering": Heart,
  "Children's Homes": Building2,
  "Education": GraduationCap,
  "Children's Social Work": Users,
  "Adult Social Work": User,
  "Leaving Care": Flag,
  "Other": Plus,
};

// Safe display helper: shows "—" when a value is missing
const show = (v) => (v === undefined || v === null ? "—" : v);

export default function CreateVideo() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const isDescriptionStep = currentStep === "Description";
  const isSectorStep = currentStep === "Sector";

  const currentValue = isDescriptionStep ? description : answers[currentStep];
  const canProceed = isDescriptionStep ? description.trim().length > 0 : Boolean(currentValue);

  const selectOption = (option) => {
    setAnswers({ ...answers, [currentStep]: option });
  };

  const goNext = async () => {
    if (!isLastStep) {
      setStepIndex(stepIndex + 1);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchVideoPlan(description, answers.Sector);
      console.log("PLAN RESULT", data);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

  if (result) {
    const cost = result.cost_analysis ?? {};
    const reuse = result.reuse_analysis ?? {};
    const providers = result.provider_decision?.comparison_table ?? [];

    return (
      <div>
        <h1 className="text-3xl font-display font-semibold mb-6">Video Plan Ready</h1>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden mb-4">
          <div className="aspect-video bg-black flex flex-col items-center justify-center p-8 relative border-b border-white/10">
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-xs text-white/50">PREVIEW</span>
            </div>
            <pre className="whitespace-pre-wrap text-sm text-white/90 max-h-full overflow-y-auto leading-relaxed">
              {result.generated_script ?? ""}
            </pre>
          </div>
          <div className="p-4 flex items-center justify-between">
            <div className="text-sm text-white/50">Script Preview — Video not yet rendered</div>
            <div className="text-xs px-2 py-1 rounded bg-neon-green/10 text-neon-green">
              Draft
            </div>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-4">
          <div className="text-sm text-white/50 mb-1">Reuse Analysis</div>
          <div className="text-2xl font-display">{show(reuse.reuse_percentage)}% reusable</div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-4">
          <div className="text-sm text-white/50 mb-3">Cost Estimation & Provider Recommendation</div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-xs text-white/40 mb-2">Generation Cost Breakdown</div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/50">Provider Generation</span>
                  <span>£{show(cost.base_cost)}</span>
                </div>
                <div className="flex justify-between font-medium pt-1 border-t border-white/10">
                  <span>Estimated Total</span>
                  <span className="text-neon-green">£{show(cost.final_estimated_cost)}</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-white/40 mb-2">RAG Library Savings</div>
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-white/50">Without Reuse</span>
                  <span>£{show(cost.base_cost)}</span>
                </div>
                <div className="flex justify-between font-medium pt-1 border-t border-white/10">
                  <span>Saved</span>
                  <span className="text-neon-green">£{show(cost.saving)} ({show(cost.saving_percentage)}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="text-xs text-white/40 mb-2">Provider Comparison</div>
            <table className="w-full text-xs">
              <thead>
                <tr className="text-white/30 text-left">
                  <th className="pb-2">Provider</th>
                  <th className="pb-2 text-right">Cost</th>
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
                      <td className="py-1">{p.provider} {p.recommended && "(Recommended)"}</td>
                      <td className="py-1 text-right">£{show(p.total_cost)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {result.recommended_avatar && (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-4">
            <div className="text-sm text-white/50 mb-1">Recommended Avatar</div>
            <div className="font-medium">{result.recommended_avatar?.id}</div>
            <div className="text-sm text-white/50 mt-1">{result.recommended_avatar?.text}</div>
          </div>
        )}

        {result.recommended_background && (
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-4">
            <div className="text-sm text-white/50 mb-1">Recommended Background</div>
            <div className="font-medium">{result.recommended_background?.id}</div>
            <div className="text-sm text-white/50 mt-1">{result.recommended_background?.text}</div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold">Create Video Wizard</h1>
      <p className="text-white/40 text-sm mb-6">Veyra Orchestration Engine</p>

      <div className="flex items-center mb-8 overflow-x-auto">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium ${
                  i === stepIndex
                    ? "bg-neon-green text-black"
                    : i < stepIndex
                    ? "bg-neon-green/20 text-neon-green"
                    : "bg-white/5 text-white/30"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-[9px] whitespace-nowrap ${i === stepIndex ? "text-white" : "text-white/30"}`}>
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className="w-6 h-px bg-white/10 mb-4" />}
          </div>
        ))}
      </div>

      {isSectorStep && (
        <p className="text-sm text-white/50 mb-4">
          Select target sector for video compliance & tone alignment
        </p>
      )}

      {isDescriptionStep ? (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the video you would like us to create."
          rows={6}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-8 text-white placeholder-white/30 focus:border-neon-green outline-none"
        />
      ) : isSectorStep ? (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {OPTIONS.Sector.map((option) => {
            const Icon = SECTOR_ICONS[option];
            const selected = answers.Sector === option;
            return (
              <button
                key={option}
                onClick={() => selectOption(option)}
                className={`p-4 rounded-xl border text-left transition ${
                  selected
                    ? "border-neon-green bg-neon-green/5"
                    : "border-white/10 bg-white/[0.02] hover:border-white/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={18} className={selected ? "text-neon-green" : "text-white/40"} />
                  {selected && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neon-green/10 text-neon-green">● SELECTED</span>
                  )}
                </div>
                <div className="font-medium text-sm">{option}</div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 mb-8">
          {OPTIONS[currentStep].map((option) => (
            <button
              key={option}
              onClick={() => selectOption(option)}
              className={`p-4 rounded-xl border text-left transition ${
                currentValue === option
                  ? "border-neon-green bg-neon-green/10 font-medium"
                  : "border-white/10 bg-white/[0.03] hover:border-white/30"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-error mb-4">{error}</p>}

      <div className="flex gap-3">
        {stepIndex > 0 && (
          <button onClick={goBack} className="border border-white/20 text-white px-5 py-2.5 rounded-lg hover:border-white/40">
            ← Back
          </button>
        )}
        <button
          onClick={goNext}
          disabled={!canProceed || loading}
          className="bg-neon-green text-black font-medium px-5 py-2.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed ml-auto"
        >
          {loading ? "Generating..." : isLastStep ? "Create Video →" : `Next Step — ${STEPS[stepIndex + 1] || ""} →`}
        </button>
      </div>
    </div>
  );
}