type ClipboardType = "text" | "image" | "document" | "unknown";

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

export function guessCliboardDataType(
  clipboardData: DataTransfer | null,
): ClipboardType {
  const types = clipboardData.types;

  const isText =
    types.length <= 0 || (types.includes("text/plain") && types.length === 1);
  const isImageFromWeb = types.includes("text/html") && types.includes("Files");

  // WARNING: the order of the checks is important
  // since the clipboardData.types is an array
  // might contain multiple types
  // e.g. ["text/html", "Files"]
  // therefore, we need to check the most specific type first
  //
  if (isText) return "text";

  // if is a file from the web
  // e.g. "Copy image" from an image on a website
  if (isImageFromWeb) return "image";
  // if is a file from local
  // e.g. "Copy" from a local file
  else if (types.includes("Files")) {
    const file = clipboardData.files[0];

    if (file.type.includes("image/")) return "image";
    if (DOCUMENT_MIMES.includes(file.type)) return "document";
  }

  return "unknown";
}
