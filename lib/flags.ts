import optimizely from "@optimizely/optimizely-sdk";
import { get } from "@vercel/edge-config";
import { flag } from "flags/next";
import { dispatchEvent } from "./event-dispatcher";
import { getShopperFromHeaders } from "./utils";

export const showBuyNowFlag = flag<{
  enabled: boolean;
  buttonText?: string;
}>({
  key: "buynow",
  description: "Flag for showing Buy Now button on PDP",
  options: [
    { label: "Hide", value: { enabled: false } },
    { label: "Show", value: { enabled: true } },
  ],
  async decide({ headers }) {
    const datafile = await get("datafile");

    if (!datafile) {
      throw new Error("Failed to retrive datafile from Vercel Edge Config");
    }

    let flag = { enabled: false, buttonText: "" };

    try {
      const client = optimizely.createInstance({
        datafile: datafile as object,
        eventDispatcher: {
          dispatchEvent,
        },
      });

      if (!client) {
        throw new Error("Failed to create client");
      }

      await client.onReady({ timeout: 500 });

      const shopper = getShopperFromHeaders(headers);
      const context = client.createUserContext(shopper);

      if (!context) {
        throw new Error("Failed to create user context");
      }

      const decision = context.decide("buynow");
      flag = {
        enabled: decision.enabled,
        buttonText: decision.variables.buynow_text as string,
      };
    } catch (error) {
      console.error("Optimizely error:", error);
    } finally {
      return flag;
    }
  },
});

export const showPromoBannerFlag = flag<boolean>({
  key: "showPromoBanner",
  defaultValue: false,
  description: "Flag for showing promo banner on homepage",
  options: [
    { value: false, label: "Hide" },
    { value: true, label: "Show" },
  ],
  async decide({ headers }) {
    const datafile = await get("datafile");

    if (!datafile) {
      throw new Error("Failed to retrieve datafile from Vercel Edge Config");
    }

    let flag = false;

    try {
      const client = optimizely.createInstance({
        datafile: datafile as object,
        eventDispatcher: {
          dispatchEvent,
        },
      });

      if (!client) {
        throw new Error("Failed to create client");
      }

      await client.onReady({ timeout: 500 });

      const shopper = getShopperFromHeaders(headers);
      const context = client!.createUserContext(shopper);

      if (!context) {
        throw new Error("Failed to create user context");
      }

      const decision = context.decide("showpromo");
      flag = decision.enabled;
    } catch (error) {
      console.error("Optimizely error:", error);
    } finally {
      return flag;
    }
  },
});

export const precomputeFlags = [showPromoBannerFlag] as const;
