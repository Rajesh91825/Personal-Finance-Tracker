export const rupee = (val: number | string) => {
  const num = typeof val === "string" ? Number(val) : val;
  if (Number.isNaN(num)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
};
