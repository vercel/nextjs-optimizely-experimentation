"use server";

import optimizely from "@optimizely/optimizely-sdk";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function trackProductPurchase() {
  const client = optimizely.createInstance({
    sdkKey: process.env.OPTIMIZELY_SDK_KEY!,
  });

  if (!client) {
    throw new Error("Failed to create client");
  }

  await client.onReady();

  const cookieStore = await cookies();
  const shopper = cookieStore.get("shopper")?.value;
  const context = client?.createUserContext(shopper);

  if (!context) {
    throw new Error("Failed to create user context");
  }

  context.trackEvent("product_purchase");
}

export async function addToCart(productId: string) {
  const cookieStore = await cookies();
  let cartItems: string[] = [];
  if (cookieStore.has("cart")) {
    cartItems = JSON.parse(cookieStore.get("cart")?.value!) as string[];
  }
  cookieStore.set(
    "cart",
    JSON.stringify([...cartItems.filter((i) => i !== productId), productId])
  );
}

export async function removeFromCart(productId: string) {
  const cookieStore = await cookies();
  const cartItems = JSON.parse(cookieStore.get("cart")?.value!) as string[];
  cookieStore.set(
    "cart",
    JSON.stringify(cartItems.filter((i) => i !== productId))
  );
  redirect("/cart");
}

export async function placeOrder() {
  const cookieStore = await cookies();
  cookieStore.set("cart", JSON.stringify([]));
  await trackProductPurchase();
  redirect("/success");
}

export async function getShopperCookie(): Promise<string | "default"> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("shopper");
  return cookie?.value ? cookie.value : "default";
}