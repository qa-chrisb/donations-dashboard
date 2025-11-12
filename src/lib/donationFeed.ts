const DEFAULT_SRC = `${import.meta.env.BASE_URL ?? "/"}data/donations.json`;

export type DonationRow = {
  id: string;
  name: string;
  date: string;
  amountMajor: number;
  currency: string;
  isRefund: boolean;
};

export type DonationFeed = {
  rows: DonationRow[];
  currencies: string[];
  singleCurrency: string | null;
  totalMajor: number | null;
  updatedAt: string | null;
};

export type FeedOptions = {
  src?: string;
  currencyHint?: string;
};

export async function loadDonationFeed(
  options: FeedOptions = {},
): Promise<DonationFeed> {
  const src = options.src ?? DEFAULT_SRC;
  const currencyHint = options.currencyHint?.toUpperCase();

  let donationsRaw: unknown[] = [];
  try {
    if (/^https?:\/\//i.test(src)) {
      const response = await fetch(src);
      donationsRaw = await response.json();
    } else {
      const rel = src.replace(/^\//, "");
      const fileUrl = new URL(`../../public/${rel}`, import.meta.url);
      const fs = await import("node:fs/promises");
      const fileContent = await fs.readFile(fileUrl, "utf8");
      donationsRaw = JSON.parse(fileContent);
    }
  } catch {
    donationsRaw = [];
  }

  const rows = donationsRaw
    .map((entry) => normaliseRow(entry, currencyHint))
    .filter(Boolean)
    .sort(
      (a, b) => new Date(b!.date).getTime() - new Date(a!.date).getTime(),
    ) as DonationRow[];

  const currencies = Array.from(new Set(rows.map((row) => row.currency)));
  const singleCurrency =
    currencyHint ?? (currencies.length === 1 ? currencies[0] : null);
  const totalMajor = singleCurrency
    ? rows.reduce(
        (sum, row) =>
          sum + (row.currency === singleCurrency ? row.amountMajor : 0),
        0,
      )
    : null;

  return {
    rows,
    currencies,
    singleCurrency,
    totalMajor,
    updatedAt: rows[0]?.date ?? null,
  };
}

function normaliseRow(
  entry: unknown,
  currencyHint?: string,
): DonationRow | null {
  if (!entry || typeof entry !== "object") return null;
  const record = entry as Record<string, unknown>;

  if (
    typeof record.occurred_at === "string" &&
    typeof record.amount_minor === "number"
  ) {
    const currency = (
      currencyHint ??
      (record.currency as string) ??
      "GBP"
    ).toUpperCase();
    const status =
      typeof record.status === "string" ? record.status.toUpperCase() : "";
    const isRefund = status === "REFUNDED";
    const amountMinor = Number(record.amount_minor);
    const amountMajor = (isRefund ? -Math.abs(amountMinor) : amountMinor) / 100;
    return {
      id: String(record.id ?? `${record.provider}:${record.occurred_at}`),
      name: String(record.donor_alias ?? "Anonymous"),
      date: record.occurred_at,
      amountMajor,
      currency,
      isRefund,
    };
  }

  if (
    typeof record.date === "string" &&
    (typeof record.amount === "number" || typeof record.amount === "string")
  ) {
    const currency = (
      currencyHint ??
      (record.currency as string) ??
      "GBP"
    ).toUpperCase();
    const amount =
      typeof record.amount === "string" ? Number(record.amount) : record.amount;
    if (Number.isNaN(amount)) return null;
    return {
      id: String(record.id ?? record.date),
      name: String(record.name ?? "Anonymous"),
      date: record.date,
      amountMajor: amount,
      currency,
      isRefund: false,
    };
  }

  return null;
}
