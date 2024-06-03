import { formatDateToISO8601 } from "../utils/dates";
import { isURLSecure, maybeAddScheme } from "../utils/utils";

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

export type ItemType = "text" | "image" | "document" | "unknown";

export type BaseItem = {
  type: ItemType;
  rawMimeType: string;
};

export type FileItem = BaseItem & {
  extension?: string;
  name?: string;
  lastModified?: string;
  rawFile?: File;
};

export type DocumentItem = FileItem & {
  src: string;
};

export type ImageItem = FileItem & {
  src: string;
};

export type TextItem = BaseItem & {
  text: string;
};

export type URLItem = TextItem & URLData;

// ======================================================
// UTILS
// ======================================================

export function buildFileItem(
  file: File,
  type: ItemType = "unknown",
): FileItem {
  return {
    type,
    rawMimeType: file.type,
    extension: file.name.split(".").pop(),
    name: file.name.split(".").shift(),
    lastModified: formatDateToISO8601(new Date(file.lastModified)),
    rawFile: file,
  };
}

export function buildDocumentItem(file: File): DocumentItem {
  return {
    ...buildFileItem(file, "document"),
    src: URL.createObjectURL(file),
  };
}

export function buildImageItem(file: File): ImageItem {
  return {
    ...buildFileItem(file, "image"),
    src: URL.createObjectURL(file),
  };
}

export function buildURLItem(url: string): URLItem {
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
