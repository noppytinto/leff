import {
  BaseItem,
  buildDocumentItem,
  buildImageItem,
  DocumentItem,
  ImageItem,
} from "./item";

const DOCUMENT_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/markdown",
  "text/plain",
];

function buildFileItem(
  clipboardData: DataTransfer,
): BaseItem | DocumentItem | ImageItem {
  const types = clipboardData.types;

  // WARNING: the order of the checks is important
  // since the clipboardData.types is an array
  // might contain multiple types
  // e.g. ["text/html", "Files"]
  // therefore, we need to check the most specific type first
  //
  // if is a file from the web
  // e.g. "Copy image" from an image on a website
  if (types.includes("text/html") && types.includes("Files")) {
    const file = clipboardData.files[0];
    console.log(file);
    return buildImageItem(file);
  }
  // if is a file from local
  // e.g. "Copy" from a local file
  else if (types.includes("Files")) {
    const file = clipboardData.files[0];

    if (file.type.includes("image/")) return buildImageItem(file);
    if (DOCUMENT_MIMES.includes(file.type)) return buildDocumentItem(file);
  }

  return {
    type: "unknown",
  } as BaseItem;
}

export default buildFileItem;
