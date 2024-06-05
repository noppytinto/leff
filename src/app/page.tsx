"use client";

import React, { useEffect, useRef } from "react";
import debounce from "lodash/debounce";
import {
  buildURLItem,
  DocumentItem,
  FileItem,
  ImageItem,
  URLItem,
} from "../entities/item";
import Image from "next/image";
import buildFileItem from "../entities/buildFileItem";
import { useGetPageMetadata } from "../hooks/useGetPageMetadata";
import { useGetUrlMetadata } from "../hooks/useGetUrlMetadata";
import { isValidURL } from "../utils/utils";
// import styles from "./App.module.scss";

const DEFAULT_DEBOUNCE = 1000;

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const urlPreviewImageRef = useRef<HTMLImageElement>(null);
  const [fileItem, setFileItem] = React.useState<FileItem | ImageItem | null>(
    null,
  );
  const pasteFlag = useRef(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [clipboardData, setClipboardData] = React.useState<DataTransfer | null>(
    null,
  );
  const [errorFileMessage, setErrorFileMessage] = React.useState<string>("");
  const [urlItem, setUrlItem] = React.useState<URLItem | null>(null);

  const {
    metadata: pageMetadata,
    isLoading: pageMetadataIsLoading,
    errorMessage: pageMetadataError,
    resetMetadata: resetPageMetadata,
  } = useGetPageMetadata(inputValue);

  const {
    metadata: urlMetadata,
    isLoading: urlMetadataIsLoading,
    errorMessage: urlMetadataError,
  } = useGetUrlMetadata(inputValue);

  // ============================================
  // SIDE EFFECTS
  // ============================================
  /**
   * build URL item
   */
  useEffect(() => {
    setFileItem(null);
    if (!urlMetadata) {
      setUrlItem(null);
      return;
    }

    const urlItem = buildURLItem(urlMetadata);

    if (urlItem.type === "unknown") {
      setUrlItem(null);
      return;
    }

    setUrlItem(urlItem);
  }, [urlMetadata]);

  /**
   * Build pasted item
   */
  useEffect(() => {
    if (!clipboardData) return;

    const types = clipboardData.types;
    console.log("fffffffffffffffffffffffffffffff my funcking types:", types);
    setErrorFileMessage("");

    // if it's ONLY text/plain
    if (
      types.length <= 0 ||
      (types.includes("text/plain") && types.length === 1)
    ) {
      console.log("fffffffffffffffffffffffffffffff text/plain");
      const text = clipboardData.getData("text/plain");
      return setInputValue(text);
    }

    // if it's a file (image or document)
    resetPageMetadata();
    const item = buildFileItem(clipboardData);

    if (item.type !== "unknown") {
      return setFileItem(item);
    }

    setErrorFileMessage(
      "Please enter a valid URL (must be remote) or a valid document file",
    );
    setFileItem(null);
    setUrlItem(null);
    setClipboardData(null);
  }, [clipboardData, urlMetadata]);

  // ============================================
  // FUNCTIONS
  // ============================================
  function handleInputChange(inputUrl: string | null) {
    setErrorFileMessage("");
    // setFileItem(null);
    // setUrlItem(null);
    setInputValue(inputUrl);
  }

  function handleOnPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    pasteFlag.current = true;

    // TODO: fix image broken after paste 2nd time
    if (urlPreviewImageRef && urlPreviewImageRef.current)
      urlPreviewImageRef.current.style.display = "block";
    setErrorFileMessage("");
    inputRef.current.value = "";

    setClipboardData(event.clipboardData);
  }

  function handleOnErrorPagePreviewImage(
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) {
    console.log("fffffffffffffffffffffffffffffffffffffffffff error:", event);
    urlPreviewImageRef.current.style.display = "none";
  }

  // ============================================
  // JSX
  // ============================================
  return (
    <main className="flex h-lvh flex-col items-center justify-center gap-8 p-3">
      <form
        className="flex flex-col items-center justify-center gap-2"
        noValidate
        onSubmit={(event) => {
          // disable form submission
          event.preventDefault();
        }}
      >
        <input
          id="form-input"
          name="input"
          type="text"
          className=" h-12 w-96 rounded-full border border-solid border-gray-100 px-4 py-2 shadow-md"
          onChange={debounce(async (event) => {
            // paste event has higher priority,
            // so we need to prevent the change event
            // from being triggered
            if (pasteFlag.current) {
              pasteFlag.current = false;
              return;
            }

            handleInputChange(event.target.value);
          }, DEFAULT_DEBOUNCE)}
          placeholder="Type or Paste here..."
          onPaste={handleOnPaste}
          ref={inputRef}
        />

        {errorFileMessage && (
          <p className="text-red-500">
            {errorFileMessage ||
              "Please enter a valid URL (must be remote) or a valid document file"}
          </p>
        )}

        {urlMetadataError && (
          <p className="text-red-500">
            {urlMetadataError || "Please enter a valid URL (must be remote)"}
          </p>
        )}

        {pageMetadataError && (
          <p className="text-red-500">
            {pageMetadataError || "Error fetching page metadata"}
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

      {/*=============================================== PAGE CARD*/}
      {urlItem && urlItem.type === "url" && (
        <div className="flex flex-col items-center justify-center gap-2">
          {pageMetadataIsLoading && (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          )}
          {pageMetadata && (
            <div className="flex h-[200px] max-w-[500px] flex-col items-center justify-center gap-2">
              <div className="flex flex-col justify-center gap-4 rounded-md border border-solid border-gray-300 p-4">
                <div className="flex items-center gap-2">
                  <Image
                    loader={() => pageMetadata.favicon}
                    src={pageMetadata.favicon}
                    alt="favicon"
                    className="min-h-[20px] min-w-[20px] rounded-sm object-contain"
                    width={20}
                    height={20}
                  />
                  <p className="line-clamp-1 text-lg font-bold">
                    {pageMetadata.title}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className=" line-clamp-4 self-start text-wrap text-sm">
                    {pageMetadata.description}
                  </p>
                  <img
                    src={pageMetadata.image}
                    alt="image"
                    ref={urlPreviewImageRef}
                    className="max-w-[120px] self-stretch rounded-md object-cover shadow-md"
                    onError={handleOnErrorPagePreviewImage}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/*=============================================== IMAGE CARD*/}
      {!pageMetadata && fileItem && fileItem.type === "image" && (
        <div className=" relative h-[150px] w-1/4">
          <Image
            src={(fileItem as ImageItem).src}
            alt="image"
            fill
            objectFit="contain"
          />
        </div>
      )}

      {/*=============================================== DOCUMENT CARD*/}
      {!pageMetadata && fileItem && fileItem.type === "document" && (
        <div className=" justify-censter flex flex-col items-center gap-2 p-4">
          <div className="relative flex h-[200px] w-[150px] flex-col items-center justify-center gap-2 rounded-md rounded-tr-3xl border border-solid border-gray-300 p-4">
            <p className="absolute -left-[.5em] top-4 rounded-md rounded-bl-md border border-gray-100 bg-gray-100 px-4 py-1 text-sm font-bold text-gray-600 shadow-md">
              .{(fileItem as FileItem).extension}
            </p>
            <p className="w-full truncate text-wrap text-center text-sm font-bold text-gray-500">
              {(fileItem as FileItem).name}
            </p>
          </div>
          <a
            href={(fileItem as DocumentItem).src}
            target="_blank"
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Open
          </a>
        </div>
      )}

      {/*=============================================== METADATA CARD*/}
      {urlMetadataIsLoading && (
        <div className="flex items-center justify-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      )}
      {!fileItem && urlItem && (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <p>metadata:</p>
          <pre className="w-full overflow-auto rounded-md border border-solid border-gray-300 bg-slate-100 p-4">
            {urlItem && JSON.stringify(urlItem, null, 2)}
          </pre>
        </div>
      )}
    </main>
  );
}
