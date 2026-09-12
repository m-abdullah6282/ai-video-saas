import { useState } from "react";
import { mockSectors } from "../lib/mockData";

// Brief Section 6: 9-step wizard (Sector → Country → Audience → Tone →
// Culture → Video Type → Format → Duration → Description).
// This is Step 1 only — the pattern established here (local state,
// "Next" button) repeats for every step. We build one step fully,
// working end-to-end, before copy-pasting the pattern for the rest —
// that way if the pattern is wrong, we only fix it once.
export default function CreateVideo() {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-semibold text-navy mb-1">Create Video</h1>
      <p className="text-steel mb-6">Step 1 of 9 — Sector</p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {mockSectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className={`p-4 rounded-lg border text-left transition ${
              selectedSector === sector
                ? "border-teal bg-teal/10 text-navy font-medium"
                : "border-steel/30 bg-white hover:border-teal"
            }`}
          >
            {sector}
          </button>
        ))}
      </div>

      <button
        disabled={!selectedSector}
        className="bg-navy text-white px-5 py-2 rounded disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next: Country →
      </button>
    </div>
  );
}
