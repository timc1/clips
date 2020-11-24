import getApiUrl from "lib/getApiUrl";
import { TLinkMetadata } from "lib/types";
import { client } from "../lib/ApiClient";

export async function unfurlUrl(
  url: string
): Promise<{
  metadata?: TLinkMetadata;
}> {
  const response = await client.get(`${getApiUrl()}/api/unfurl`, { url });

  if (response.error) {
    throw response.error;
  }

  return {
    metadata: response.metadata,
  };
}
