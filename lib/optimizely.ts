import type { Client, Event } from "@optimizely/optimizely-sdk";
import optimizely from "@optimizely/optimizely-sdk";
import { get } from "@vercel/edge-config";
import { after } from "next/server";

async function initOptimizely(): Promise<Client> {
	const datafile = await get("datafile");

	if (!datafile) {
		throw new Error("Failed to retrieve datafile from Vercel Edge Config");
	}

	const client = optimizely.createInstance({
		datafile: datafile as object,
		eventDispatcher: { dispatchEvent },
	});

	if (!client) {
		throw new Error("Failed to create Optimizely client");
	}

	await client.onReady({ timeout: 500 });
	return client;
}

const optimizelyClientPromise: Promise<Client> = initOptimizely();

/**
 * Returns a singleton Optimizely client backed by a top-level Promise.
 * This collapses concurrent initialization to one in-flight promise,
 * preventing race conditions that could create multiple clients.
 */
export function ensureOptimizely(): Promise<Client> {
	return optimizelyClientPromise;
}

/**
 * Web standards friendly event dispatcher for Optimizely
 * uses `after` to avoid blocking the visitor's page load
 */
async function dispatchEvent(
	event: Event,
	callback?: (response: { statusCode: number }) => void,
) {
	// Non-POST requests not supported
	if (event.httpVerb !== "POST") {
		return;
	}

	const url = new URL(event.url);
	const data = JSON.stringify(event.params);

	after(async () => {
		try {
			const response = await fetch(url, {
				method: "POST",
				body: data,
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				callback?.({ statusCode: response.status });
			}
		} catch (error) {
			console.error("Error dispatching event:", error);
		}
	});
}
