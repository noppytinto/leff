import { isSecure, maybeAddScheme } from "../utils/utils";
import { URLItem } from "./item";

export type URLData = {
  fullUrl: string;
  scheme: string;
  host: string;
  port: string;
  path: string;
  query: string;
  fragment: string;
  isSecure: boolean;
};

export function parseURL(url: string): URLItem {
  let urlData: URL = undefined;
  try {
    url = maybeAddScheme(url);
    urlData = new URL(url);
  } catch (error) {
    console.error("Invalid URL", error);
  }

  return {
    type: "text",
    text: url,
    rawMimeType: "text/plain",
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
