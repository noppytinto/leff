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

export type ItemType =
  | "text"
  | "image"
  | "document"
  | "unknown"
  | "url"
  | "fileUrl";

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
    type: isFileUrl(url) ? "fileUrl" : "url",
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

function isFileUrl(url) {
  const imagePattern = /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico|tiff|tif|psd)$/i;
  const documentPattern =
    /\.(pdf|doc|docx|xls|xlsx|ppt|pptx|odt|ods|odp|odg|txt|csv|rtf|tex)$/i;
  const codePattern =
    /\.(html|htm|css|js|php|py|rb|java|c|cpp|h|sh|bat|cmd|go|rs|pl|swift|sql|r|kt|ts|tsx|vue|sc|scala|jl|lua|ini|cfg|conf|log)$/i;
  const executablePattern = /\.(exe|dll|bin|iso|dmg|img|msi|app|deb|rpm)$/i;
  const archivePattern = /\.(zip|rar|7z|tar|gz|bz2|xz|lz|z)$/i;
  const audioPattern = /\.(mp3|wav|flac|aac|ogg|m4a|wma)$/i;
  const videoPattern =
    /\.(mp4|avi|mkv|mov|wmv|flv|webm|mpg|mpeg|3gp|m4v|m2ts|mts|vob|rm|rmvb|asf|f4v)$/i;

  return (
    imagePattern.test(url) ||
    documentPattern.test(url) ||
    codePattern.test(url) ||
    executablePattern.test(url) ||
    archivePattern.test(url) ||
    audioPattern.test(url) ||
    videoPattern.test(url)
  );
}
