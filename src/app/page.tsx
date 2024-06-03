"use client";

import React from "react";
import { isValidURL, maybeAddScheme } from "../utils/utils";
import { parseURL } from "../entities/urlData";
// import styles from "./App.module.scss";
import debounce from "lodash/debounce";

type MimeType = "text" | "image" | "application" | "unknown";
type ClipboardItem = {
  type: "text" | "image" | "application" | "unknown";
  extension: string;
  title: string;
  lastModified: number;
};

function getSupportedType(blob: Blob): MimeType {
  if (blob.type.includes("text")) return "text";
  if (blob.type.includes("image")) return "image";
  if (blob.type.includes("application")) return "application";
  return "unknown";
}

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

function getTitle(blob: Blob): string | null {
  return blob.name || null;
}

function getLasModified(blob: Blob): number | null {
  return blob.lastModified ?? null;
}

function getTypeFromBlob(blob: Blob): string {
  return blob.type;
}

function parseBlobToClipboardItem(blob: Blob): ClipboardItem {
  const type = getSupportedType(blob);
  const extension = getFileExtension(blob);
  const title = getTitle(blob);
  const lastModified = getLasModified(blob);

  return {
    type,
    extension,
    title,
    lastModified,
  };
}

/**
 * might be useful to check if the blob
 * is from an HTML file
 *
 * @param blob
 * @returns
 */
function isFromHtml(blob: Blob): boolean {
  return blob.type.includes("text/html");
}

function typeIsImage(types: readonly string[]): boolean {
  return !!types.filter((type) => type.includes("image")).length;
}

function typeIsText(types: readonly string[]): boolean {
  return !!types.filter((type) => type.includes("text")).length;
}

function typeIsDocument(types: readonly string[]): boolean {
  return !!types.filter((type) => type.includes("application")).length;
}

async function printBlobMetadata(blob: Blob) {
  const type = getSupportedType(blob);
  const extension = getFileExtension(blob);
  const title = getTitle(blob);
  const lastModified = getLasModified(blob);

  console.log("ffffffffffffffffffffffff type", type);
  console.log("ffffffffffffffffffffffff extension", extension);
  console.log("ffffffffffffffffffffffff title", title);
  console.log("ffffffffffffffffffffffff lastModified", lastModified);
}

function getAnyDataFromClipboad(): ClipboardItem | null {
  // check if the Clipboard API is supported first
  if (!navigator.clipboard) {
    console.error("Clipboard API is not supported in this browser");
    return null;
  }

  navigator.clipboard
    .read()
    .then((clipboardItems) => {
      clipboardItems.forEach(async (item) => {
        console.log("fffffffffffffffffffffffffffff item", item);

        const types = item.types;

        // if type contains image
        if (typeIsImage(types)) {
          console.log("fffffffffffffffffffffffffffff image");
          const blob = await item.getType(types[1]);
          console.log("fffffffffffffffffffff blob", blob);
          printBlobMetadata(blob);
        } else if (typeIsDocument(types)) {
          console.log("fffffffffffffffffffffffffffff document");
          const blob = await item.getType("application/pdf");
          printBlobMetadata(blob);
        } else if (typeIsText(types)) {
          console.log("fffffffffffffffffffffffffffff text");
          const blob = await item.getType("text/plain");
          const text = await blob.text();
          console.log("ffffffffffffffffffffffff text", text);
          printBlobMetadata(blob);
        }

        // console.log(blob.type);

        // if (blob.type.includes("text")) {
        //   const text = await blob.text();
        //   const type = getSupportedType(blob);
        //   const extension = getFileExtension(blob);
        //   const title = getTitle(blob);
        //   const lastModified = getLasModified(blob);

        //   console.log("ffffffffffffffffffffffff text", text);
        //   console.log("ffffffffffffffffffffffff type", type);
        //   console.log("ffffffffffffffffffffffff extension", extension);
        //   console.log("ffffffffffffffffffffffff title", title);
        //   console.log("ffffffffffffffffffffffff lastModified", lastModified);
        //   return { type: "text", text };
        // } else if (blob.type.includes("image")) {
        //   const image = await blob.arrayBuffer();
        //   const type = getSupportedType(blob);
        //   const extension = getFileExtension(blob);
        //   const title = getTitle(blob);
        //   const lastModified = getLasModified(blob);

        //   console.log("ffffffffffffffffffffffff type", type);
        //   console.log("ffffffffffffffffffffffff extension", extension);
        //   console.log("ffffffffffffffffffffffff title", title);
        //   console.log("ffffffffffffffffffffffff lastModified", lastModified);

        //   console.log(image);
        // }
      });
    })
    .catch((err) => {
      console.error("Failed to read clipboard items:", err);
    });
}

export default function Home() {
  const [url, setUrl] = React.useState("");
  const urlInputRef = React.useRef<HTMLInputElement>(null);
  const [isUrlValid, setIsUrlValid] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [urlData, setUrlData] = React.useState("");

  const [clipboardItem, setClipboardItem] =
    React.useState<ClipboardItem | null>(null);

  // ============================================
  // FUNCTIONS
  // ============================================
  function handleUrlChange(url: string) {
    let internalUrl = url;

    const isValid = isValidURL(internalUrl);
    if (!isValid) {
      setErrorMessage("Please enter a valid URL");
      setUrlData("");
    } else {
      internalUrl = maybeAddScheme(internalUrl);
      setErrorMessage("");
      const data = parseURL(internalUrl);
      setUrlData(JSON.stringify(data, null, 2));
    }

    setUrl(internalUrl);
    setIsUrlValid(isValid);
  }

  function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log(url);
  }

  // ============================================
  // JSX
  // ============================================
  return (
    <main className="flex h-lvh flex-col items-center justify-center gap-8 p-3">
      <form
        onSubmit={onFormSubmit}
        className="flex flex-col items-center justify-center gap-2"
        noValidate
      >
        <input
          id="url"
          name="url"
          type="url"
          className=" h-12 w-96 rounded-full border border-solid border-gray-100 px-4 py-2 shadow-md"
          onChange={debounce((event) => {
            console.log(event);
            handleUrlChange(event.target.value);
          }, 500)}
          placeholder="Type your URL here"
        />

        {!isUrlValid && (
          <p className="text-red-500">
            {errorMessage || "Please enter a valid URL"}
          </p>
        )}

        {/* <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Submit
        </button> */}
      </form>

      <div className="flex flex-col items-center justify-center gap-4">
        <p>OR</p>
        <button
          onClick={getAnyDataFromClipboad}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Paste anything from clipboard
        </button>
      </div>

      <div>
        <p>metadata:</p>
        <pre className="h-96 w-96 overflow-auto rounded-md border border-solid border-gray-300 bg-slate-100 p-4">
          {clipboardItem && JSON.stringify(clipboardItem, null, 2)}
        </pre>
      </div>
    </main>
  );
}
