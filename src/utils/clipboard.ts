export function clipboardItemIsImage(clipboardItem: ClipboardItem): boolean {
  const types = clipboardItem.types;

  return !!types.filter((type) => type.includes("image")).length;
}

export function clipboardItemIsText(clipboardItem: ClipboardItem): boolean {
  const types = clipboardItem.types;
  return !!types.filter((type) => type.includes("text")).length;
}

export function clipboardItemIsDocument(clipboardItem: ClipboardItem): boolean {
  const types = clipboardItem.types;
  return !!types.filter((type) => type.includes("application")).length;
}
