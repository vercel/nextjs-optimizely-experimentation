import type { Event } from "@optimizely/optimizely-sdk";
import { after } from "next/server";

/**
 * Web standards friendly event dispatcher for Optimizely
 * uses `after` to avoid blocking the visitor's page load
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
