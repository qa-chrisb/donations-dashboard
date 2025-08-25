// src/lib/getDonations.ts
import type { Donation } from "./types";
import { getEnabledProviders } from "./providers";

const DAYS = 30;

function sinceISO(): string {
    return new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000).toISOString();
}

function ymd(d: Date) { return d.toISOString().slice(0, 10); }

export async function loadDonations() {
    const providers = getEnabledProviders();
    const nowISO = new Date().toISOString();

    const results = await Promise.all(providers.map(p => p.fetchSince(sinceISO())));
    const map = new Map<string, Donation>();
    for (const arr of results) {
        for (const d of arr) {
            const key = `${d.provider}:${d.id}`;
            if (!map.has(key)) map.set(key, d);
        }
    }
    const donations = [...map.values()].sort(
        (a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime()
    );

    // per-currency total (sum of amounts, refunds negative)
    const per_currency: Record<string, number> = {};
    // per-currency daily totals (YYYY-MM-DD -> minor total)
    const daily_by_currency: Record<string, Record<string, number>> = {};
    // per-currency per-provider totals
    const provider_by_currency: Record<string, Record<string, number>> = {};

    for (const d of donations) {
        const sign = d.status === "REFUNDED" ? -1 : 1;
        const val = sign * Math.abs(d.amount_minor);
        // currency total
        per_currency[d.currency] = (per_currency[d.currency] ?? 0) + val;
        // daily totals
        const day = ymd(new Date(d.occurred_at));
        (daily_by_currency[d.currency] ??= {});
        daily_by_currency[d.currency][day] = (daily_by_currency[d.currency][day] ?? 0) + val;
        // provider share
        (provider_by_currency[d.currency] ??= {});
        provider_by_currency[d.currency][d.provider] = (provider_by_currency[d.currency][d.provider] ?? 0) + val;
    }

    // Ensure missing days are present (with zero) for each currency for the last N days
    const days: string[] = [];
    for (let i = DAYS - 1; i >= 0; i--) {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - i);
        days.push(ymd(d));
    }
    for (const ccy of Object.keys(daily_by_currency)) {
        const row = daily_by_currency[ccy];
        for (const d of days) if (!(d in row)) row[d] = 0;
        // keep days in order
        daily_by_currency[ccy] = Object.fromEntries(days.map(d => [d, row[d]]));
    }

    return {
        updated_at: nowISO,
        donations,
        totals: { per_currency, daily_by_currency, provider_by_currency, days }
    };
}
