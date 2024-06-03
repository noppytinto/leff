import { isSecure, maybeAddScheme } from "../utils/utils";

type URLData = {
  fullUrl: string;
  scheme: string;
  host: string;
  port: string;
  path: string;
  query: string;
  fragment: string;
  isSecure: boolean;
};

export function parseURL(url: string): URLData {
  let urlData: URL = undefined;
  try {
    url = maybeAddScheme(url);
    urlData = new URL(url);
  } catch (error) {
    console.error("Invalid URL", error);
  }

  return {
    fullUrl: url,
    scheme: urlData?.protocol?.replace(":", "") || "",
    host: urlData?.hostname || "",
    port: urlData?.port || "",
    path: urlData?.pathname || "",
    query: urlData?.search || "",
    fragment: urlData?.hash || "",
    isSecure: isSecure(url),
  };
}
