// Core domain types shared between apps/web and apps/api.
// Keeping these in one place prevents frontend/backend from drifting apart.

export type ProviderName = "heygen" | "synthesia" | "creatify";

export interface Organization {
  id: string;
  name: string;
  sector: string; // e.g. "adult-care", "education", "corporate"
  country: string;
  createdAt: string;
}

export interface Avatar {
  id: string;
  organizationId: string; // isolation: which org's private library this belongs to
  provider: ProviderName;
  providerAvatarId: string; // the provider's own ID for this avatar — NOT portable across providers
  name: string;
  sector: string[];
  country: string[];
  language: string[];
  previousUsageCount: number;
}

export interface Voice {
  id: string;
  organizationId: string;
  provider: ProviderName;
  providerVoiceId: string;
  language: string;
  accent: string;
  tone: string;
}

export interface Background {
  id: string;
  organizationId: string;
  category: string; // "care-home" | "school" | "office" | ...
  country: string;
  assetUrl: string; // our own stored copy (S3), reusable regardless of original provider
}

export interface VideoJob {
  organizationId: string;
  sector: string;
  country: string;
  audience: string;
  tone: string;
  videoType: string;
  format: "16:9" | "9:16" | "1:1";
  durationSeconds: number;
  description: string;
}

export interface CostEstimate {
  providerGenerationCost: number;
  otherAiCost: number;
  internalProcessingCost: number;
  totalEstimated: number;
  estimatedCostWithoutReuse: number;
  estimatedSaving: number;
}

export interface ReuseAnalysis {
  reusablePercentage: number; // e.g. 76
  newGenerationPercentage: number; // e.g. 24
  matchedAssets: {
    avatar?: string;
    voice?: string;
    background?: string;
    intro?: string;
    outro?: string;
    script?: string;
  };
}

export interface GenerationHandle {
  provider: ProviderName;
  externalJobId: string;
}

export type GenerationStatus =
  | "queued"
  | "generating"
  | "processing"
  | "ready_for_review"
  | "failed";

// The common interface every provider adapter must implement.
// This is what makes adding/removing providers possible without
// touching the rest of the application.
export interface VideoProvider {
  name: ProviderName;
  listAvatars(): Promise<Avatar[]>;
  listVoices(): Promise<Voice[]>;
  estimateCost(job: VideoJob): Promise<CostEstimate>;
  createVideo(job: VideoJob): Promise<GenerationHandle>;
  checkStatus(handle: GenerationHandle): Promise<GenerationStatus>;
  downloadVideo(handle: GenerationHandle): Promise<Buffer>;
}
