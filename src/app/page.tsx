"use client";

import React, { useRef } from "react";
import { isValidURL, maybeAddScheme } from "../utils/utils";
import debounce from "lodash/debounce";
import {
  buildDocumentItem,
  buildImageItem,
  buildURLItem,
  DocumentItem,
  FileItem,
  ImageItem,
  URLItem,
} from "../entities/item";
import Image from "next/image";
import buildPastedItem from "../entities/buildPastedItem";
// import styles from "./App.module.scss";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [item, setItem] = React.useState<FileItem | ImageItem | URLItem | null>(
    null,
  );
  const pasteFlag = useRef(false);
  const [errorMessage, setErrorMessage] = React.useState("");

  // ============================================
  // FUNCTIONS
  // ============================================
  function parseUrl(givenUrl: string) {
    setErrorMessage("");

    if (!givenUrl) {
      setItem(null);
      return;
    }

    let url = givenUrl;

    const isValid = isValidURL(url);
    if (!isValid) {
      setErrorMessage("Please enter a valid URL(must be remote)");
      setItem(null);
    } else {
      url = maybeAddScheme(url);
      const urlItem = buildURLItem(url);
      setItem(urlItem);
    }
  }

  // function onFormSubmit(event: React.FormEvent<HTMLFormElement>) {
  //   event.preventDefault();
  // }

  function handleOnPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    pasteFlag.current = true;
    setErrorMessage("");
    inputRef.current.value = "";

    const clipboardData = event.clipboardData;
    const item = buildPastedItem(clipboardData);

    if (item.type === "unknown") {
      setErrorMessage(
        "Please enter a valid URL (must be remote) or a valid document file",
      );
      setItem(null);
    } else {
      setItem(item);
    }
  }

  // ============================================
  // JSX
  // ============================================
  return (
    <main className="flex h-lvh flex-col items-center justify-center gap-8 p-3">
      <form
        className="flex flex-col items-center justify-center gap-2"
        noValidate
      >
        <input
          id="form-input"
          name="input"
          type="text"
          className=" h-12 w-96 rounded-full border border-solid border-gray-100 px-4 py-2 shadow-md"
          onChange={debounce((event) => {
            // paste event has higher priority,
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

      {item && item.type === "image" && (
        <div className=" relative h-[150px] w-1/4">
          <Image
            src={(item as ImageItem).src}
            alt="image"
            fill
            objectFit="contain"
          />
        </div>
      )}

      {item && item.type === "document" && (
        <div className=" justify-censter flex flex-col items-center gap-2 p-4">
          <div className="relative flex h-[200px] w-[150px] flex-col items-center justify-center gap-2 rounded-md rounded-tr-3xl border border-solid border-gray-300 p-4">
            <p className="absolute -left-[.5em] top-4 rounded-md rounded-bl-md border border-gray-100 bg-gray-100 px-4 py-1 text-sm font-bold text-gray-600 shadow-md">
              .{(item as FileItem).extension}
            </p>
            <p className="w-full text-wrap text-center text-sm font-bold text-gray-500">
              {(item as FileItem).name}
            </p>
          </div>
          <a
            href={(item as DocumentItem).src}
            target="_blank"
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Open
          </a>
        </div>
      )}

      {item && (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <p>metadata:</p>
          <pre className="w-full overflow-auto rounded-md border border-solid border-gray-300 bg-slate-100 p-4">
            {item && JSON.stringify(item, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
