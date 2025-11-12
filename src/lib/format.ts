export const fmtMoney = (
  minor: number,
  ccy: string,
  locale: Intl.LocalesArgument = "en-GB",
) =>
  new Intl.NumberFormat(locale, { style: "currency", currency: ccy }).format(
    minor / 100,
  );

export const fmtMajor = (
  major: number,
  ccy: string,
  locale: Intl.LocalesArgument = "en-GB",
) =>
  new Intl.NumberFormat(locale, { style: "currency", currency: ccy }).format(
    major,
  );

export const maxOf = (vals: number[]) => Math.max(0, ...vals);
export const sum = (vals: number[]) => vals.reduce((a, b) => a + b, 0);
