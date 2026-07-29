export type Currency = "USD" | "NGN" | "GBP" | "EUR";

export const CURRENCIES: { code: Currency; label: string; symbol: string; rate: number }[] = [
  { code: "USD", label: "US Dollar", symbol: "$", rate: 1 },
  { code: "EUR", label: "Euro", symbol: "€", rate: 0.92 },
  { code: "GBP", label: "British Pound", symbol: "£", rate: 0.79 },
  { code: "NGN", label: "Nigerian Naira", symbol: "₦", rate: 1550 },
];

export function formatMoney(usd: number, currency: Currency = "USD") {
  const info = CURRENCIES.find((c) => c.code === currency)!;
  const value = usd * info.rate;
  const formatter = new Intl.NumberFormat("en", {
    style: "currency",
    currency: info.code,
    maximumFractionDigits: currency === "NGN" ? 0 : 2,
  });
  try {
    return formatter.format(value);
  } catch {
    return `${info.symbol}${value.toFixed(2)}`;
  }
}
