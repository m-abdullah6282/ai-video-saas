// Core domain shapes shared between apps/web and apps/api.
// Documented with JSDoc instead of TypeScript types — same benefit
// (editor autocomplete, clear contracts) without adding a compile step.

/**
 * @typedef {"heygen"|"synthesia"|"creatify"} ProviderName
 *
 * @typedef {Object} Organization
 * @property {string} id
 * @property {string} name
 * @property {string} sector
 * @property {string} country
 * @property {string} createdAt
 *
 * @typedef {Object} Avatar
 * @property {string} id
 * @property {string} organizationId  - isolation: which org's private library this belongs to
 * @property {ProviderName} provider
 * @property {string} providerAvatarId - the provider's own ID — NOT portable across providers
 * @property {string} name
 * @property {string[]} sector
 * @property {string[]} country
 * @property {string[]} language
 * @property {number} previousUsageCount
 *
 * @typedef {Object} VideoJob
 * @property {string} organizationId
 * @property {string} sector
 * @property {string} country
 * @property {string} audience
 * @property {string} tone
 * @property {string} videoType
 * @property {"16:9"|"9:16"|"1:1"} format
 * @property {number} durationSeconds
 * @property {string} description
 *
 * @typedef {Object} CostEstimate
 * @property {number} providerGenerationCost
 * @property {number} otherAiCost
 * @property {number} internalProcessingCost
 * @property {number} totalEstimated
 * @property {number} estimatedCostWithoutReuse
 * @property {number} estimatedSaving
 *
 * @typedef {Object} GenerationHandle
 * @property {ProviderName} provider
 * @property {string} externalJobId
 *
 * @typedef {"queued"|"generating"|"processing"|"ready_for_review"|"failed"} GenerationStatus
 */

// The contract every provider adapter must follow. In plain JS this is
// enforced by convention + tests (not the compiler), so every adapter's
// test file must assert all five methods exist and return the right shape.
export const VIDEO_PROVIDER_METHODS = [
  "listAvatars",
  "listVoices",
  "estimateCost",
  "createVideo",
  "checkStatus",
  "downloadVideo",
];
