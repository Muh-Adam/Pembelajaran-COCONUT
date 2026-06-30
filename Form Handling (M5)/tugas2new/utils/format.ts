// Format currency to IDR
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Compact format: 15.750.000 → Rp 15,75 jt
export function formatCompact(amount: number): string {
  if (amount >= 1_000_000_000) return `Rp ${(amount / 1_000_000_000).toFixed(2)} M`;
  if (amount >= 1_000_000) return `Rp ${(amount / 1_000_000).toFixed(2)} jt`;
  if (amount >= 1_000) return `Rp ${(amount / 1_000).toFixed(1)} rb`;
  return formatIDR(amount);
}

// Format date to Indonesian locale
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Get current month as "YYYY-MM"
export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}
