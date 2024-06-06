import { NextRequest } from "next/server";
import { isURLSecure, isValidURL, maybeAddScheme } from "../../../utils/utils";
import { sanitizeUrl } from "../../../utils/url";
import { BaseApiResponse } from "../../../types/response";
import { URLMetadata } from "../../../types/URLMetadata";

export type URLMetadataResponse = BaseApiResponse & URLMetadata;

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const urlParam = searchParams.get("url");

  if (!isValidURL(urlParam)) {
    return new Response("Invalid URL", { status: 400 });
  }

  const originalUrl = sanitizeUrl(maybeAddScheme(urlParam));
  const baseUrl = new URL(originalUrl).origin;
  const urlMetadata = buildURLMetadata(baseUrl);

  if (!urlMetadata) {
    return new Response("Invalid URL", { status: 400 });
  }

  return Response.json({
    ...urlMetadata,
  } satisfies URLMetadataResponse);
}

/**
 * Builds URL metadata from a given URL
 *
 * @param url URL to build metadata from
 * @returns URL metadata, or `null` if the URL is invalid
 */
function buildURLMetadata(url: string): URLMetadata | null {
  let urlData: URL;
  try {
    url = maybeAddScheme(url);
    urlData = new URL(url);
  } catch (error) {
    return null;
  }

  return {
    fullUrl: urlData?.href,
    scheme: urlData?.protocol?.replace(":", ""),
    host: urlData?.hostname,
    port: urlData?.port,
    path: urlData?.pathname,
    query: urlData?.search,
    fragment: urlData?.hash,
    isSecure: isURLSecure(url),
  };
}
