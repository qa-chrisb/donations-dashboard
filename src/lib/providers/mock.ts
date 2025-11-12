// src/providers/mock.ts
import type { Donation } from "../types.js";

export async function fetchMockSince(_sinceISO: string): Promise<Donation[]> {
  // ignore sinceISO for now, just return a few hard-coded rows
  const now = new Date();
  return [
    {
      id: "mock1",
      provider: "mock",
      occurred_at: new Date(now.getTime() - 1000 * 60 * 60).toISOString(), // 1h ago
      amount_minor: 1234, // £12.34
      currency: "GBP",
      amount_minor_gbp: 1234,
      donor_alias: "Alice",
      message: "Keep it up!",
      campaign: "general",
      status: "SUCCEEDED",
    },
    {
      id: "mock2",
      provider: "mock",
      occurred_at: new Date(now.getTime() - 1000 * 60 * 30).toISOString(), // 30m ago
      amount_minor: 500, // £5.00
      currency: "GBP",
      amount_minor_gbp: 500,
      donor_alias: "Bob",
      message: null,
      campaign: "general",
      status: "SUCCEEDED",
    },
    {
      id: "mock3",
      provider: "mock",
      occurred_at: new Date(now.getTime() - 1000 * 60 * 10).toISOString(), // 10m ago
      amount_minor: 2000, // £20.00
      currency: "GBP",
      amount_minor_gbp: 2000,
      donor_alias: "Charlie",
      message: "Great work!",
      campaign: "special",
      status: "REFUNDED",
    },
  ];
}
