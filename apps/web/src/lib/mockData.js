// Phase 1 prototype: all data here is hardcoded/fake.
// This file is the ONLY place mock data lives — when apps/api is ready
// (Phase 2+), we swap these functions for real fetch() calls without
// touching any component code, since components only import from here.

/**
 * @typedef {Object} MockVideo
 * @property {string} id
 * @property {string} title
 * @property {string} sector
 * @property {string} country
 * @property {string} status
 * @property {string} createdAt
 * @property {number} reusePercentage
 */

export const mockDashboardStats = {
  videosThisMonth: 42,
  aiSpendThisMonth: 187.3,
  ragSavingsThisMonth: 412.5,
  overallReuseRate: 68,
};

/** @type {MockVideo[]} */
export const mockVideos = [
  {
    id: "v1",
    title: "Five Signs of Safeguarding Concern",
    sector: "Adult Care",
    country: "UK",
    status: "Ready for Review",
    createdAt: "2026-09-10",
    reusePercentage: 82,
  },
  {
    id: "v2",
    title: "Welcome to Our Nursery",
    sector: "Early Years",
    country: "UK",
    status: "Approved",
    createdAt: "2026-09-08",
    reusePercentage: 55,
  },
];

export const mockSectors = [
  "Adult Care",
  "Early Years",
  "Fostering",
  "Children's Homes",
  "Education",
  "Children's Social Work",
  "Adult Social Work",
  "Leaving Care",
  "Other",
];
