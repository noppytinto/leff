import {
  BaseItem,
  buildDocumentItem,
  buildImageItem,
  buildURLItem,
  DocumentItem,
  ImageItem,
  URLItem,
} from "./item";
import { isValidURL } from "../utils/utils";

function buildPastedItem(
  clipboardData: DataTransfer,
): ImageItem | BaseItem | URLItem | DocumentItem {
  const types = clipboardData.types;
  console.log(
    "fffffffffffffffffffffffffffffffff clipboardData: ",
    clipboardData,
  );
  console.log("fffffffffffffffffffffffffffffffff types: ", types);

  // WARNING: the order of the checks is important
  // since the clipboardData.types is an array
  // might contain multiple types
  // e.g. ["text/html", "Files"]
  // therefore, we need to check the most specific type first
  //
  // if is a file from the web
  // e.g. "Copy image" from an image on a website
  if (types.includes("text/html") && types.includes("Files")) {
    console.log("image from web");

    const file = clipboardData.files[0];
    console.log(file);

    return buildImageItem(file);
  }
  // if is a file from local
  // e.g. "Copy" from a local file
  else if (types.includes("Files")) {
    console.log("from local");
    const file = clipboardData.files[0];
    console.log(file);

    if (file.type.includes("image/")) return buildImageItem(file);
    else {
      const documentMimes = [
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

      if (documentMimes.includes(file.type)) return buildDocumentItem(file);
    }
  }
  // if is plain text
  else if (types.includes("text/plain")) {
    const text = clipboardData.getData("text/plain");
    if (isValidURL(text)) return buildURLItem(text);
  }

  return {
    type: "unknown",
  } as BaseItem;
}

export default buildPastedItem;
