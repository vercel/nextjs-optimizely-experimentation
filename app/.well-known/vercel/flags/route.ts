import { getProviderData, createFlagsDiscoveryEndpoint } from "flags/next";
import * as flags from "../../../../lib/flags";

// This function handles the authorization check for you
export const GET = createFlagsDiscoveryEndpoint((request) => {
  // your previous logic in here to gather your feature flags
  const apiData = getProviderData(flags);

  // return the ApiData directly, without a NextResponse.json object.
  return apiData;
});
