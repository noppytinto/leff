import { formatDateToISO8601 } from "../utils/dates";
import { URLMetadataResponse } from "../app/api/url-meta/route";
import { URLMetadata } from "../types/URLMetadata";

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

export type PageItem = BaseItem &
  URLMetadata & {
    favicon?: string;
    image?: string;
    title?: string;
    description?: string;
  };

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

export function buildURLItem(urlMetadata: URLMetadataResponse): PageItem {
  if (urlMetadata.hasFailed) {
    return {
      ...urlMetadata,
      type: "unknown",
      rawMimeType: "text/plain",
    };
  }

  return {
    ...urlMetadata,
    type: isFileUrl(urlMetadata.fullUrl) ? "fileUrl" : "url",
    rawMimeType: "text/plain",
  };
}

function isFileUrl(url: string) {
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
