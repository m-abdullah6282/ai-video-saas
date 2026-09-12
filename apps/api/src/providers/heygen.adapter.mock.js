// Phase 1 (prototype) implementation — returns fake data, makes NO real
// network calls, spends NO real HeyGen credits.
// In Phase 4 this gets replaced by a real heygen.adapter.js that calls the
// actual HeyGen API, but implements the SAME methods (see
// packages/shared-types VIDEO_PROVIDER_METHODS) — so nothing else in the
// app has to change.

export class HeyGenMockAdapter {
  name = "heygen";

  async listAvatars() {
    return [
      {
        id: "mock-avatar-1",
        organizationId: "demo-org",
        provider: "heygen",
        providerAvatarId: "hg-avatar-001",
        name: "Professional UK Presenter",
        sector: ["adult-care", "corporate"],
        country: ["UK"],
        language: ["en-GB"],
        previousUsageCount: 3,
      },
    ];
  }

  async listVoices() {
    return [
      {
        id: "mock-voice-1",
        organizationId: "demo-org",
        provider: "heygen",
        providerVoiceId: "hg-voice-001",
        language: "en-GB",
        accent: "British",
        tone: "professional-reassuring",
      },
    ];
  }

  async estimateCost(_job) {
    return {
      providerGenerationCost: 4.2,
      otherAiCost: 0.4,
      internalProcessingCost: 0.1,
      totalEstimated: 4.7,
      estimatedCostWithoutReuse: 11.8,
      estimatedSaving: 7.1,
    };
  }

  async createVideo(_job) {
    return { provider: "heygen", externalJobId: "mock-job-123" };
  }

  async checkStatus(_handle) {
    return "ready_for_review";
  }

  async downloadVideo(_handle) {
    return Buffer.from(""); // placeholder — Phase 1 has no real video output
  }
}
