import { APP_CONFIG } from "@/constants/config";

export function formatMoney(
  amount: number,
  symbol: string = APP_CONFIG.currency.symbol,
): string {
  const digits = Math.round(amount)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${symbol} ${digits}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(APP_CONFIG.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatPeriod(period: string): string {
  const [y, m] = period.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(APP_CONFIG.locale, {
    month: "long",
    year: "numeric",
  });
}

export function formatRelative(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function greeting(date: Date = new Date()): string {
  const h = date.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(APP_CONFIG.locale, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatMessageTime(iso: string): string {
  return new Date(iso).toDateString() === new Date().toDateString()
    ? formatTime(iso)
    : `${formatDate(iso)}, ${formatTime(iso)}`;
}

export function formatFileSize(kb: number): string {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb} KB`;
}
