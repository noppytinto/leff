import { URLData } from "./urlData";

type ItemType = "text" | "image" | "document" | "unknown";

export type BaseItem = {
  type: ItemType;
  rawMimeType: string;
};

export type FileItem = BaseItem & {
  extension?: string;
  name?: string;
  lastModified?: string;
};

export type TextItem = BaseItem & {
  text: string;
};

export type URLItem = TextItem & URLData;

// ======================================================
// UTILS
// ======================================================

// TODO: improve this function
// export function getSupportedType(blob: Blob): MimeType {
//   if (blob.type.includes("image")) return "image";
//   if (blob.type.includes("application")) return "application";
//   if (blob.type.includes("text")) return "text";
//   return "unknown";
// }

// function parseBlobToImageItem(blob: Blob): ImageItem {
//   return {
//     type: "image",
//     extension: getFileExtension(blob),
//     title: getTitle(blob),
//     lastModified: getLasModified(blob),
//     rawMimeType: blob.type,
//   };
// }

function parseBlobToTextItem(blob: Blob): TextItem {
  return {
    type: "text",
    text: "TODO: implement this",
    rawMimeType: blob.type,
  };
}

// function parseBlobToDocumentItem(blob: Blob): DocumentItem {
//   return {
//     type: "application",
//     extension: getFileExtension(blob),
//     title: getTitle(blob),
//     lastModified: getLasModified(blob),
//     rawMimeType: blob.type,
//   };
// }
