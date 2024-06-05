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
import buildPastedItem from "../entities/buildPastedItem";
import { getPageMetadata, PageMetadata } from "../services/pageMetaService";
// import styles from "./App.module.scss";

const DEFAULT_DEBOUNCE = 1000;

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [item, setItem] = React.useState<FileItem | ImageItem | URLItem | null>(
    null,
  );
  const pasteFlag = useRef(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [pageMetadata, setPageMetadata] = React.useState<PageMetadata | null>(
    null,
  );
  const urlPreviewImageRef = useRef<HTMLImageElement>(null);
  const [pageMetadataIsLoading, setPageMetadataIsLoading] =
    React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [clipboardData, setClipboardData] = React.useState<DataTransfer | null>(
    null,
  );

  // fetch url metadata
  useEffect(() => {
    const ac = new AbortController();

    if (!item) return;
    if (item.type !== "url") return;

    setPageMetadata(null);
    setErrorMessage("");
    setPageMetadataIsLoading(true);

    const url = (item as URLItem).fullUrl;

    (async () => {
      const data = await getPageMetadata(url);
      if (ac.signal.aborted) return;

      console.log("fffffffffffffffffffffffffffffffffffffffffff data:", data);
      if (data.hasFailed) {
        setErrorMessage("Error fetching page metadata: " + data.errorMessage);
        setPageMetadataIsLoading(false);
        return;
      }

      setPageMetadata({
        title: data.title,
        description: data.description,
        image: data.image,
        favicon: data.favicon,
      });
      setPageMetadataIsLoading(false);
    })();

    return () => {
      ac.abort();
    };
  }, [JSON.stringify(item)]);

  useEffect(() => {
    console.log("fffffffffffffffffffffffffffffffffffffffffff myVar:");
    const ac = new AbortController();

    if (!inputValue) {
      setItem(null);
      return;
    }

    console.log("fffffffffffffffffffffffffffffffffffffffffff AFTER:");

    (async () => {
      const urlItemResponse = await buildURLItem(inputValue);

      console.log(
        "fffffffffffffffffffffffffffffffffffffffffff ac.signal.aborted:",
        ac.signal.aborted,
      );

      if (ac.signal.aborted) return;

      if (urlItemResponse.hasFailed) {
        setErrorMessage(
          "Error fetching URL metadata: " + urlItemResponse.errorMessage,
        );
        setItem(null);
        return;
      }

      setItem(urlItemResponse);
    })();

    return () => {
      ac.abort();
    };
  }, [inputValue]);

  useEffect(() => {
    const ac = new AbortController();

    if (!clipboardData) return;

    (async () => {
      const item = await buildPastedItem(clipboardData);
      if (ac.signal.aborted) return;

      if (item.type !== "unknown") {
        return setItem(item);
      }

      setErrorMessage(
        "Please enter a valid URL (must be remote) or a valid document file",
      );
      setItem(null);
    })();

    return () => {
      ac.abort();
    };
  }, [JSON.stringify(clipboardData)]);

  // ============================================
  // FUNCTIONS
  // ============================================
  async function handleInputChange(inputUrl: string | null) {
    setErrorMessage("");
    setInputValue(inputUrl);
  }

  function handleOnPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    pasteFlag.current = true;

    // TODO: fix image broken after paste 2nd time
    if (urlPreviewImageRef && urlPreviewImageRef.current)
      urlPreviewImageRef.current.style.display = "block";
    setErrorMessage("");
    inputRef.current.value = "";

    const clipboardData = event.clipboardData;
    setClipboardData(clipboardData);
  }

  function handleOnErrorPagePreviewImage(
    event: React.SyntheticEvent<HTMLImageElement, Event>,
  ) {
    console.log("fffffffffffffffffffffffffffffffffffffffffff error:", event);
    // urlPreviewImageRef.current.src = pageMetadata.favicon;

    // detect network error using next

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

            await handleInputChange(event.target.value);
          }, DEFAULT_DEBOUNCE)}
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

      {/*=============================================== URL CARD*/}
      {item && item.type === "url" && (
        <div className="flex flex-col items-center justify-center gap-2">
          {pageMetadataIsLoading && (
            <div className="flex items-center justify-center gap-2">
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-gray-900"></div>
            </div>
          )}
          {pageMetadata && (
            <div className="flex h-[200px] max-w-[500px] flex-col items-center justify-center gap-2">
              <div className="flex items-center justify-center gap-4 rounded-md border border-solid border-gray-300 p-4">
                <div className="flex flex-grow-[3] flex-col items-start justify-center gap-2">
                  <div className="flex items-center justify-center gap-2">
                    <Image
                      loader={() => pageMetadata.favicon}
                      src={pageMetadata.favicon}
                      alt="favicon"
                      className="min-h-[32px] min-w-[32px] rounded-sm object-contain"
                      width={32}
                      height={32}
                    />
                    <p className="line-clamp-2 text-lg font-bold">
                      {pageMetadata.title}
                    </p>
                  </div>
                  <p className=" line-clamp-4 text-wrap text-sm">
                    {pageMetadata.description}
                  </p>
                </div>
                <img
                  src={pageMetadata.image}
                  alt="image"
                  ref={urlPreviewImageRef}
                  className="max-w-[120px] self-stretch rounded-md object-cover shadow-md"
                  onError={handleOnErrorPagePreviewImage}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/*=============================================== IMAGE CARD*/}
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

      {/*=============================================== DOCUMENT CARD*/}
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

      {/*=============================================== METADATA CARD*/}
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
