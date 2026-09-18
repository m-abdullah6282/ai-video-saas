import { useState } from "react";
import { fetchVideoPlan } from "../lib/api";

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
    return (
      <div>
        <h1 className="text-3xl font-display font-semibold mb-6">Video Plan Ready</h1>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-4">
          <div className="text-sm text-white/50 mb-1">Reuse Analysis</div>
          <div className="text-2xl font-display">{result.reuse_analysis.reuse_percentage}% reusable</div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 mb-4">
          <div className="text-sm text-white/50 mb-1">Recommended Provider</div>
          <div className="text-2xl font-display">{result.provider_decision.recommended_provider}</div>
          <div className="text-sm text-white/50 mt-1">
            £{result.cost_analysis.final_estimated_cost} (saved £{result.cost_analysis.saving})
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
          <div className="text-sm text-white/50 mb-2">Generated Script</div>
          <pre className="whitespace-pre-wrap text-sm">{result.generated_script}</pre>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-display font-semibold mb-1">Create Video</h1>
      <p className="text-white/50 mb-8">
        Step {stepIndex + 1} of {STEPS.length} — {currentStep}
      </p>

      {isDescriptionStep ? (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the video you would like us to create."
          rows={6}
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 mb-8 text-white placeholder-white/30 focus:border-neon-green outline-none"
        />
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
          className="bg-neon-green text-black font-medium px-5 py-2.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : isLastStep ? "Create Video →" : "Next →"}
        </button>
      </div>
    </div>
  );
}