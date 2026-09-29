import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchVideoPlan } from "../lib/api";
import { savePlan } from "../lib/planStore";
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

export default function CreateVideo() {
  const navigate = useNavigate();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
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
      savePlan({ result: data, answers, description });
      navigate("/create/plan");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
  };

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