import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cookies } from 'next/headers'


const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getShopperCookie(): Promise<string | "default"> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("shopper");
  return cookie?.value ? cookie.value : "default";
}

export function formatUSD(amount: number) {
  return formatter.format(amount);
}
