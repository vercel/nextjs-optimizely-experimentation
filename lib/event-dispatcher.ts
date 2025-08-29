import type { Event } from "@optimizely/optimizely-sdk";
import { waitUntil } from "@vercel/functions";

/**
 * Web standards friendly event dispatcher for Optimizely
 * uses `waitUntil` to avoid blocking the visitor's page load
 * @param event
 * @returns
 */
export async function dispatchEvent(
	event: Event,
	callback?: (response: { statusCode: number }) => void,
) {
	// Non-POST requests not supported
	if (event.httpVerb !== "POST") {
		return;
	}

	const url = new URL(event.url);
	const data = JSON.stringify(event.params);

	waitUntil(
		fetch(url, {
			method: "POST",
			body: data,
			headers: {
				"Content-Type": "application/json",
				"Content-Length": data.length.toString(),
			},
		}).then((response) => {
			if (response.ok) {
				callback?.({ statusCode: response.status });
			}
		}),
	);
}
