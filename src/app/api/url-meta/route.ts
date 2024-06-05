import { NextRequest } from "next/server";
import { isURLSecure, isValidURL, maybeAddScheme } from "../../../utils/utils";
import { sanitizeUrl } from "../../../utils/url";
import {
  buildURLMetadata,
  URLMetadata,
} from "../../../services/urlMetaService";
import { BaseApiResponse } from "../../../types/response";

export type URLMetadataResponse = BaseApiResponse & URLMetadata;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const urlParam = searchParams.get("url");

  if (!isValidURL(urlParam)) {
    return Response.json({
      fullUrl: urlParam,
      scheme: "",
      path: "",
      host: "",
      hasFailed: true,
      errorMessage: "Invalid URL",
      isSecure: false,
    } satisfies URLMetadataResponse);
  }
  const sanitizedUrl = sanitizeUrl(maybeAddScheme(urlParam));
  const baseUrl = new URL(sanitizedUrl).origin;

  const urlMetadata = buildURLMetadata(baseUrl);

  if (!urlMetadata) {
    return Response.json({
      fullUrl: sanitizedUrl,
      scheme: "",
      path: "",
      host: "",
      hasFailed: true,
      errorMessage: "Invalid URL",
      isSecure: false,
    } satisfies URLMetadataResponse);
  }

  return Response.json({
    ...urlMetadata,
  } satisfies URLMetadataResponse);
}
