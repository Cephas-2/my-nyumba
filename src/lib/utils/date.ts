const DAY = 86_400_000;
export const daysAgo = (n: number): string => new Date(Date.now() - n * DAY).toISOString();
export const hoursAgo = (n: number): string => new Date(Date.now() - n * 3_600_000).toISOString();
export const addDays = (iso: string, n: number): string => new Date(new Date(iso).getTime() + n * DAY).toISOString();
export const daysBetween = (fromIso: string, toIso: string): number =>
  Math.round((new Date(toIso).getTime() - new Date(fromIso).getTime()) / DAY);
