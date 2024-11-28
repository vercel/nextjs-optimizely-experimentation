import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUSD(amount: number) {
  return formatter.format(amount);
}
