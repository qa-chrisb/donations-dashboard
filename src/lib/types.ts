// src/types.ts
export type Status = "SUCCEEDED" | "COMPLETED" | "REFUNDED" | "PENDING";

export interface Donation {
  id: string; // provider-native id
  provider: string; // "stripe" | "paypal" | "mock" | ...
  occurred_at: string; // ISO
  amount_minor: number; // in source currency minor units
  currency: string; // "GBP","USD",...
  amount_minor_gbp: number; // filled after FX
  donor_alias?: string | null;
  message?: string | null;
  campaign?: string | null;
  status: Status;
}

export interface Provider {
  name: string;
  fetchSince(sinceISO: string): Promise<Donation[]>; // return SUCCEEDED/COMPLETED and REFUNDED rows
}
