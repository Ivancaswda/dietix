import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
// lib/formatRelativeTime.ts
export function formatRelativeTime(date: string | Date) {
    const rtf = new Intl.RelativeTimeFormat("ru", { numeric: "auto" });

    const now = new Date();
    const target = new Date(date);
    const diffMs = target.getTime() - now.getTime();

    const seconds = Math.round(diffMs / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (Math.abs(seconds) < 60) return rtf.format(seconds, "second");
    if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    return rtf.format(days, "day");
}

export const generateRandomFrameNumber =  () => {
    const num = Math.floor(Math.random() * 10000);
    console.log(num)
    return num!
}