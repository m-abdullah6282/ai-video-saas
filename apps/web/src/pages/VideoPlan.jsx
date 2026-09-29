import { useNavigate } from "react-router-dom";
import { loadPlan } from "../lib/planStore";

// Split the generated script into sections (paragraph breaks). No timings are invented.
const splitScript = (s) =>
  (s ?? "").split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);

const BADGES = {
  reuse: "bg-neon-green/10 text-neon-green",
  new: "bg-amber-400/10 text-amber-400",
  na: "bg-white/5 text-white/30",
};

function Badge({ kind, label }) {
  return (
    <span className={`text-[9px] px-2 py-0.5 rounded ${BADGES[kind]}`}>● {label}</span>
  );
}

function Row({ title, value, kind, label }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
      <div>
        <div className="text-xs font-medium">{title}</div>
        <div className="text-[10px] text-white/40 max-w-[220px] truncate">{value}</div>
      </div>
      <Badge kind={kind} label={label} />
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between text-xs py-1">
      <span className="text-white/40">{label}</span>
      <span className="font-medium text-right">{value || "—"}</span>
    </div>
  );
}

export default function VideoPlan() {
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

  const { result, answers = {}, description = "" } = plan;
  const reusePct = result.reuse_analysis?.reuse_percentage ?? 0;
  const sections = splitScript(result.generated_script);
  const avatar = result.recommended_avatar;
  const background = result.recommended_background;
  const scriptReused = (result.based_on ?? []).length > 0;

  return (
    <div>
      <h1 className="text-2xl font-display font-semibold">Proposed AI Video Plan</h1>
      <p className="text-white/40 text-sm mb-6">
        {answers.Sector || "—"} · {answers["Video Type"] || "—"}
      </p>

      <div className="grid grid-cols-3 gap-4">
        {/* Timeline */}
        <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-xl p-4">
          <div className="text-xs text-white/50 mb-3">Proposed Video Structure Timeline</div>
          <div className="space-y-2 max-h-[480px] overflow-y-auto">
            {sections.length === 0 ? (
              <div className="text-xs text-white/30">No script returned.</div>
            ) : (
              sections.map((text, i) => (
                <div key={i} className="bg-white/[0.03] border border-white/10 rounded-lg p-3 flex gap-3">
                  <div className="w-6 h-6 rounded bg-white/5 text-[10px] flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="text-xs text-white/80 whitespace-pre-wrap leading-relaxed">{text}</div>
                </div>
              ))
            )}
          </div>
          <div className="text-[10px] text-white/30 mt-3">
            Section timings not available yet — pending structured plan from the planner.
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="text-sm font-medium mb-2">
              {description ? description.slice(0, 50) : "Untitled video"}
            </div>
            <Detail label="Sector" value={answers.Sector} />
            <Detail label="Target Country" value={answers.Country} />
            <Detail label="Tone" value={answers.Tone} />
            <Detail label="Estimated Duration" value={answers.Duration} />
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-white/50">RAG Library Optimization</div>
              <Badge kind="reuse" label="STILL REUSE" />
            </div>
            <div className="h-1.5 rounded bg-white/10 overflow-hidden mb-1">
              <div className="h-full bg-neon-green" style={{ width: `${reusePct}%` }} />
            </div>
            <div className="flex justify-between text-[10px] text-white/40 mb-3">
              <span>{reusePct}% Reusable Assets</span>
              <span>{100 - reusePct}% New Generation</span>
            </div>

            <Row
              title="Avatar"
              value={avatar?.text ?? "No matching avatar in library"}
              kind={avatar ? "reuse" : "new"}
              label={avatar ? "REUSE" : "NEW"}
            />
            <Row title="Voice Engine" value="Not available yet" kind="na" label="N/A YET" />
            <Row
              title="Background"
              value={background?.text ?? "No matching background in library"}
              kind={background ? "reuse" : "new"}
              label={background ? "REUSE" : "NEW"}
            />
            <Row title="B-roll Video" value="Not available yet" kind="na" label="N/A YET" />
            <Row
              title="Video Script"
              value={scriptReused ? "Adapted from existing scripts" : "Newly generated"}
              kind={scriptReused ? "reuse" : "new"}
              label={scriptReused ? "ADAPTED" : "NEW"}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/create")}
              className="flex-1 border border-white/20 text-white text-sm py-2.5 rounded-lg hover:border-white/40"
            >
              Edit Plan
            </button>
            <button
              onClick={() => navigate("/create/cost")}
              className="flex-1 bg-neon-green text-black text-sm font-medium py-2.5 rounded-lg"
            >
              Approve Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}