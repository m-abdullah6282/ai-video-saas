import { useState } from "react";
import { mockSectors } from "../lib/mockData";

// Brief Section 6: 9-step wizard (Sector → Country → Audience → Tone →
// Culture → Video Type → Format → Duration → Description).
// This is Step 1 only — the pattern established here (local state,
// "Next" button) repeats for every step. We build one step fully,
// working end-to-end, before copy-pasting the pattern for the rest —
// that way if the pattern is wrong, we only fix it once.
export default function CreateVideo() {
  const [selectedSector, setSelectedSector] = useState(null);

  return (
    <div>
      <h1 className="text-3xl font-display font-semibold mb-1">Create Video</h1>
      <p className="text-white/50 mb-8">Step 1 of 9 — Sector</p>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {mockSectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={`p-4 rounded-xl border text-left transition ${
              selectedSector === sector
                ? "border-neon-green bg-neon-green/10 font-medium"
                : "border-white/10 bg-white/[0.03] hover:border-white/30"
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      <button
        disabled={!selectedSector}
        className="bg-neon-green text-black font-medium px-5 py-2.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Next: Country →
      </button>
    </div>
  );
}