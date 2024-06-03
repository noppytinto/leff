"use client";

import React, { useRef } from "react";
import { isValidURL, maybeAddScheme } from "../utils/utils";
import { parseURL } from "../entities/urlData";
// import styles from "./App.module.scss";
import debounce from "lodash/debounce";
import { FileItem, TextItem, URLItem } from "../entities/item";
// import {
//   clipboardItemIsImage,
// } from "../utils/clipboard";

// async function pasteImage() {
//   try {
//     const clipboardContents = await navigator.clipboard.read();
//     for (const item of clipboardContents) {
//       if (clipboardItemIsImage(item)) {
//         console.log("is image from web");
//         const mimeType = item.types.find((type) => type.includes("image"));
//         const blob = await item.getType(mimeType);
//         return URL.createObjectURL(blob);
//       } else {
//         console.log("is NOT image from web");
//         // maybe might be a local file
//         const type = await item.getType("text/plain");
//         const mimeType = item.types.find((type) => type.includes("text"));
//         const blob = await item.getType(mimeType);
//         return URL.createObjectURL(blob);
//       }
//     }
//   } catch (error) {
//     console.log(error.message);
//   }
//
//   return null;
// }

// async function getAnyDataFromClipboad(): BaseItem | null {
//   // check if the Clipboard API is supported first
//   if (!navigator.clipboard) {
//     console.error("Clipboard API is not supported in this browser");
//     return null;
//   }

//   const urlImage = await pasteImage();
//   console.log("urlImage", urlImage);

//   // navigator.clipboard
//   //   .read()
//   //   .then((clipboardItems) => {
//   //     clipboardItems.forEach(async (item) => {
//   //       console.log("fffffffffffffffffffffffffffff item", item);

//   //       // WARNING:
//   //       // the order of the checks is important
//   //       // because the ClipboardItem can have multiple types
//   //       // and we need to check for the most specific type first
//   //       // e.g. if the item is an image copied from a website
//   //       // it will have types: ["text/html", "image/png"]
//   //       // so we need to check if it's an image first
//   //       if (clipboardItemIsImage(item)) {
//   //         const types = item.types;
//   //         const blob = await item.getType(types[1]);
//   //         console.log("ffffffffffffffffffffffff blob", blob);
//   //         const file = createFileFromBlob(blob);
//   //         console.log("ffffffffffffffffffffffff file", file);
//   //       } else if (clipboardItemIsDocument(item)) {
//   //         const blob = await item.getType("application/pdf");
//   //         console.log("ffffffffffffffffffffffff blob", blob);
//   //         const file = createFileFromBlob(blob);
//   //         console.log("ffffffffffffffffffffffff file", file);
//   //       } else if (clipboardItemIsText(item)) {
//   //         const blob = await item.getType("text/plain");
//   //         console.log("ffffffffffffffffffffffff blob", blob);
//   //         const file = createFileFromBlob(blob);
//   //         console.log("ffffffffffffffffffffffff file", file);

//   //         const text = await blob.text();
//   //         console.log("ffffffffffffffffffffffff text", text);

//   //         if (isValidURL(text)) {
//   //           console.log("ffffffffffffffffffffffff valid url", text);
//   //         }
//   //       }
//   //     });
//   //   })
//   //   .catch((err) => {
//   //     console.error("Failed to read clipboard items:", err);
//   //   });
// }

/**
 * Format a date into ISO8601
 * YYYY-MM-DD
 * @param date
 */
function formatDateIntoISO8601(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
}

export default function Home() {
  // const [url, setUrl] = React.useState("");
  // const [isUrlValid, setIsUrlValid] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [imageSrc, setImageSrc] = React.useState<string | null>("");
  const [item, setItem] = React.useState<FileItem | TextItem | URLItem | null>(
    null,
  );
  const pasteFlag = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ============================================
  // FUNCTIONS
  // ============================================
  function parseUrl(url: string) {
    if (!url) {
      console.log("fffffffffffffffffffffffffffffffffffffffffff url:", url);
      setItem(null);
      setErrorMessage("");
      // setIsUrlValid(false);
      return;
    }

    console.log("fffffffffffffffffffffffffffffffffffffffffff change event");
    let internalUrl = url;

    const isValid = isValidURL(internalUrl);
    if (!isValid) {
      setErrorMessage("Please enter a valid URL(must be remote)");
      setItem(null);
    } else {
      internalUrl = maybeAddScheme(internalUrl);
      setErrorMessage("");
      const data = parseURL(internalUrl);
      setItem(data);
    }

    // setUrl(internalUrl);
    // setIsUrlValid(isValid);
  }

  function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // console.log(url);
  }

  // async function handleOnPastButtonClick() {
  //   getAnyDataFromClipboad();
  //   const url = (await pasteImage()) || "";

  //   setImageSrc(url);
  // }

  function handleOnPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    pasteFlag.current = true;
    console.log("fffffffffffffffffffffffffffffffffffffffffff paste event");

    console.log("onPaste");
    const clipboardData = event.clipboardData;
    const types = clipboardData.types;
    console.log(clipboardData);
    console.log(types);

    // if is a file from the web
    // e.g. "Copy image" from a website
    if (types.includes("text/html") && types.includes("Files")) {
      console.log("from web");

      // get file
      const file = clipboardData.files[0];
      const name = file.name;
      const extension = file.name.split(".").pop();
      const mimeType = file.type;
      console.log(file);

      setItem({
        type: "document",
        rawMimeType: mimeType,
        extension,
        name,
        lastModified: formatDateIntoISO8601(new Date(file.lastModified)),
      });
      event.currentTarget.value = "";
    }
    // if is a file from local
    // e.g. "Copy" from the local file system
    else if (types.includes("Files")) {
      console.log("from local");
      // get file
      const file = clipboardData.files[0];
      const name = file.name;
      const extension = file.name.split(".").pop();
      const mimeType = file.type;
      console.log(file);

      setItem({
        type: "document",
        rawMimeType: mimeType,
        extension,
        name,
        lastModified: formatDateIntoISO8601(new Date(file.lastModified)),
      });

      event.currentTarget.value = "";
    }
    // if is plain text
    else if (types.includes("text/plain")) {
      const text = clipboardData.getData("text/plain");
      console.log("text: ", text);
      const isValid = isValidURL(text);

      if (isValid) {
        console.log("valid url");

        // if contains some extension at the end
        // it might be a remote/local file
        const hasExtensionRegex = /\.[a-zA-Z0-9]+$/;
        if (text.match(hasExtensionRegex)) {
          console.log("might be a remote/local file");
        }
        parseUrl(text);
      } else {
        setErrorMessage("Please enter a valid URL (must be remote)");
        setItem({
          type: "text",
          text,
          rawMimeType: "text/plain",
        });
      }
    } else {
      console.log("unknown type");
    }
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
          type="text"
          className=" h-12 w-96 rounded-full border border-solid border-gray-100 px-4 py-2 shadow-md"
          onChange={debounce((event) => {
            // paste event has higher priority
            // so we need to prevent the change event
            // from being triggered
            if (pasteFlag.current) {
              pasteFlag.current = false;
              return;
            }

            parseUrl(event.target.value);
          }, 500)}
          placeholder="Type or Paste here..."
          onPaste={handleOnPaste}
          ref={inputRef}
        />

        {errorMessage && (
          <p className="text-red-500">
            {errorMessage || "Please enter a valid URL (must be remote)"}
          </p>
        )}

        {/* <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Submit
        </button> */}
      </form>
      {/* 
      <div className="flex flex-col items-center justify-center gap-4">
        <p>OR</p>
        <button
          onClick={handleOnPastButtonClick}
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Paste anything from clipboard
        </button>
      </div> */}

      {/* <div
        id="drop_zone"
        className="flex h-96 w-96 flex-col items-center justify-center gap-6 rounded-md border border-solid border-gray-300 bg-slate-100 p-4"
        onDrop={(event) => {
          // Prevent default behavior (Prevent file from being opened)
          event.preventDefault();
          console.log("File(s) dropped");

          if (event.dataTransfer.items) {
            // Use DataTransferItemList interface to access the file(s)
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
              // If dropped items aren't files, reject them
              if (event.dataTransfer.items[i].kind === "file") {
                const file = event.dataTransfer.items[i].getAsFile();
                console.log("... file[" + i + "].name = " + file.name);
              }
            }
          } else {
            // Use DataTransfer interface to access the file(s)
            for (let i = 0; i < event.dataTransfer.files.length; i++) {
              console.log(
                "... file[" +
                  i +
                  "].name = " +
                  event.dataTransfer.files[i].name,
              );
            }
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
        }}
      >
        <p className="text-center">
          Drag one or more files <br /> to this <i>drop zone</i>.
        </p>
        <p className="text-center">
          OR, click to <i>upload</i> files.
        </p>

        <div>
          <label
            htmlFor="file-input"
            className="cursor-pointer rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Upload file
          </label>
          <input
            type="file"
            id="file-input"
            multiple
            className="hidden"
            onChange={(event) => {
              console.log(event.target.files);
            }}
          />
        </div>
      </div> */}

      {/* <div>
        <Image src={imageSrc} alt="image" width={"500"} height={"500"} />
      </div> */}

      <div className="flex w-full flex-col items-center justify-center gap-2">
        <p>metadata:</p>
        <pre className="h-96 w-full overflow-auto rounded-md border border-solid border-gray-300 bg-slate-100 p-4">
          {item && JSON.stringify(item, null, 2)}
        </pre>
      </div>
    </main>
  );
}
