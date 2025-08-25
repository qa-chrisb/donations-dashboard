export const fmtMoney = (minor: number, ccy: string) =>
    new Intl.NumberFormat(undefined, { style: "currency", currency: ccy }).format(minor / 100);

export const maxOf = (vals: number[]) => Math.max(0, ...vals);
export const sum = (vals: number[]) => vals.reduce((a, b) => a + b, 0);
