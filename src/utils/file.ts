function getFileExtension(blob) {
  // If blob has a name property, use it to extract extension
  if (blob.name) {
    return blob.name.split(".").pop();
  }

  // If blob has a type property, extract extension from it
  if (blob.type) {
    return blob.type.split("/").pop();
  }

  // If neither name nor type is available, return null
  return null;
}

// function getTitle(blob: Blob): string | null {
//   if (!blob.name) {
//     return null;
//   }

//   return blob.name || null;
// }

// function getLasModified(blob: Blob): number | null {
//   return blob.lastModified ?? null;
// }

function getTypeFromBlob(blob: Blob): string {
  return blob.type;
}

/**
 * might be useful to check if the blob
 * is from an HTML file
 *
 * @param blob
 * @returns
 */
export function isBlobFromHtml(blob: Blob): boolean {
  return blob.type.includes("text/html");
}

export function createFileFromBlob(blob) {
  const file = new File([blob], "file", {
    type: blob.type,
  });

  return file;
}

export const hasExtensionRegex = /\.[a-zA-Z0-9]+$/;
