// src/providers/index.ts
import type { Provider } from "../types.js";
import { fetchMockSince } from "./mock.js";

const all: Record<string, Provider> = {
    mock: { name: "mock", fetchSince: fetchMockSince },
};

export function getEnabledProviders(): Provider[] {
    // e.g. PROVIDERS="stripe,paypal,mock"
    const list = (process.env.PROVIDERS ?? "mock")
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

    const enabled = list.map(k => {
        const p = all[k];
        if (!p) throw new Error(`Unknown provider: ${k}`);
        return p;
    });

    // de-dup while preserving order
    const seen = new Set<string>();
    return enabled.filter(p => (seen.has(p.name) ? false : (seen.add(p.name), true)));
}
