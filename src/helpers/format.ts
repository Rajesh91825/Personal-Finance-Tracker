// src/helpers/format.ts
export function rupee(amount: number | string): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (!num || isNaN(num)) return "₹0.00";
  return num.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
