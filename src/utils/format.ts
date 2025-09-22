export function rupee(n: number | string) {
  const num = typeof n === "string" ? Number(n) || 0 : n || 0;
  return "₹" + num.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function dateOnly(raw: string | Date) {
  const d = new Date(raw);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
}
