import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeSince(date: string | Date): string {
  if (!(typeof date === "string" || date instanceof Date)) {
    return "";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const timeElapsed = Date.now() - dateObj.getTime();

  if (timeElapsed < 60000) {
    // less than 1 minute
    return Math.floor(timeElapsed / 1000) + " s";
  } else if (timeElapsed < 3600000) {
    // less than 1 hour
    return Math.floor(timeElapsed / 60000) + " m";
  } else if (timeElapsed < 86400000) {
    // less than 1 day
    return Math.floor(timeElapsed / 3600000) + " h";
  } else if (timeElapsed < 604800000) {
    // less than 1 week
    return Math.floor(timeElapsed / 86400000) + " d";
  } else if (timeElapsed < 29030400000) {
    // less than 1 year
    return Math.floor(timeElapsed / 2419200000) + " mo";
  } else {
    // more than 1 year
    return Math.floor(timeElapsed / 29030400000) + " y";
  }
}
