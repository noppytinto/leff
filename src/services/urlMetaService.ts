import { URLMetadataResponse } from "../app/api/url-meta/route";

const BASE_API_URL_META_URL = "/api/url-meta";

export type URLMetadata = {
  fullUrl: string;
  scheme: string;
  host: string;
  port?: string;
  path: string;
  query?: string;
  fragment?: string;
  isSecure: boolean;
};

export async function getURLMetadata(
  url: string,
): Promise<URLMetadataResponse> {
  const apiUrl = BASE_API_URL_META_URL + "?url=" + url;

  try {
    const response = await fetch(apiUrl);

    console.log(
      "fffffffffffffffffffffffffffffffffffffffffff response:",
      response,
    );

    if (!response.ok) {
      console.error(
        "fffffffffffffffffffffffffffffffffffffffffff ERROR response not ok:",
        response.statusText,
      );
      return {
        fullUrl: url,
        scheme: "",
        host: "",
        path: "",
        isSecure: false,
        hasFailed: true,
        errorMessage: response.statusText,
        statusCode: response.status,
      };
    }

    const data: URLMetadataResponse = await response.json();

    if (data.hasFailed) {
      return {
        fullUrl: url,
        scheme: "",
        host: "",
        path: "",
        isSecure: false,
        hasFailed: true,
        errorMessage: data.errorMessage,
      };
    }

    return {
      fullUrl: data.fullUrl,
      scheme: data.scheme,
      host: data.host,
      port: data.port,
      path: data.path,
      query: data.query,
      fragment: data.fragment,
      isSecure: data.isSecure,
    };
  } catch (error) {
    console.error(
      "fffffffffffffffffffffffffffffffffffffffffff ERROR fetching URL metadata:",
      error,
    );

    return {
      fullUrl: url,
      scheme: "",
      host: "",
      path: "",
      isSecure: false,
      hasFailed: true,
      errorMessage: String(error),
    };
  }
}
