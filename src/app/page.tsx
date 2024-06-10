"use client";

import React, { useEffect, useRef } from "react";
import debounce from "lodash/debounce";
import {
  buildDocumentItem,
  buildImageItem,
  buildURLItem,
  DocumentItem,
  ImageItem,
  PageItem,
} from "../entities/item";
import { useGetPageMetadata } from "../hooks/useGetPageMetadata";
import { useGetUrlMetadata } from "../hooks/useGetUrlMetadata";
import { ImageItemCard } from "../components/ImageItemCard";
import { DocumentItemCard } from "../components/DocumentItemCard";
import { LoadingCircle } from "../components/ui/LoadingCircle";
import { PageItemCard } from "../components/PageItemCard";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { Card } from "../components/ui/Card";
import { RoundedInput } from "../components/inputs/RoundedInput";
import { guessCliboardDataType } from "../utils/guessCliboardDataType";
// import styles from "./App.module.scss";

const DEFAULT_DEBOUNCE = 1000;

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pasteFlag = useRef(false);
  const [inputValue, setInputValue] = React.useState<string>("");
  const [clipboardData, setClipboardData] = React.useState<DataTransfer | null>(
    null,
  );
  const [errorFileMessage, setErrorFileMessage] = React.useState<string>("");
  const [item, setItem] = React.useState<
    ImageItem | DocumentItem | PageItem | null
  >(null);

  const {
    metadata: pageMetadata,
    isLoading: pageMetadataIsLoading,
    isError: pageMetadataIsError,
    errorMessage: pageMetadataError,
    resetMetadata: resetPageMetadata,
  } = useGetPageMetadata(inputValue);

  const {
    metadata: urlMetadata,
    isLoading: urlMetadataIsLoading,
    isError: urlMetadataIsError,
    errorMessage: urlMetadataError,
  } = useGetUrlMetadata(inputValue);

  // ============================================
  // SIDE EFFECTS
  // ============================================
  /**
   * build URL item
   */
  useEffect(() => {
    setItem(null);
    if (!urlMetadata) return;

    const urlItem = buildURLItem(urlMetadata);

    if (urlItem.type === "unknown") {
      setItem(null);
      return;
    }

    setItem(urlItem);
  }, [urlMetadata]);

  /**
   * Build pasted item
   */
  useEffect(() => {
    if (!clipboardData) return;
    setErrorFileMessage("");

    const clipboardDataType = guessCliboardDataType(clipboardData);

    // aka if is a URL
    if (clipboardDataType === "text") {
      const text = clipboardData.getData("text/plain");
      setInputValue(text);
    } else if (clipboardDataType === "image") {
      resetPageMetadata();
      const item = buildImageItem(clipboardData.files[0]);
      setItem(item);
    } else if (clipboardDataType === "document") {
      resetPageMetadata();
      const item = buildDocumentItem(clipboardData.files[0]);
      setItem(item);
    } else {
      // if (clipboardDataType === "unknown")
      setErrorFileMessage(
        "Please enter a valid URL (must be remote) or a valid document file",
      );
      setItem(null);
      setClipboardData(null);
    }
  }, [clipboardData, urlMetadata]);

  // ============================================
  // FUNCTIONS
  // ============================================
  function handleInputChange(inputUrl: string | null) {
    if (!errorFileMessage) setErrorFileMessage("");
    setInputValue(inputUrl);
  }

  function handleOnPaste(event: React.ClipboardEvent<HTMLInputElement>) {
    pasteFlag.current = true;

    setErrorFileMessage("");
    inputRef.current.value = "";
    setClipboardData(event.clipboardData);
  }

  // ============================================
  // JSX
  // ============================================
  return (
    <main className="flex h-lvh flex-col items-center justify-center gap-8 p-3">
      <form
        className="flex flex-col items-center justify-center gap-2"
        noValidate
        onSubmit={(ev) => ev.preventDefault()}
      >
        <RoundedInput
          id="form-input"
          name="input"
          ref={inputRef}
          onChange={debounce(async (event) => {
            // paste event has higher priority,
            // therefore we need to prevent the change event
            if (pasteFlag.current) {
              pasteFlag.current = false;
              return;
            }

            handleInputChange(event.target.value);
          }, DEFAULT_DEBOUNCE)}
          onPaste={handleOnPaste}
          placeholder="Type or Paste here..."
        />

        {/* <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Submit
        </button> */}
      </form>

      {/*========================================== ERROR MESSAGE*/}
      {/* when url has an error, has priority over page preview */}
      {urlMetadataIsError ? (
        <ErrorMessage
          text={urlMetadataError || "Please enter a valid URL (must be remote)"}
        />
      ) : (
        pageMetadataIsError && (
          <ErrorMessage
            text={pageMetadataError || "Error fetching page metadata"}
          />
        )
      )}

      {errorFileMessage && (
        <ErrorMessage
          text={
            errorFileMessage ||
            "Please enter a valid URL (must be remote) or a valid document file"
          }
        />
      )}
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
      {item && item.type === "url" && (
        <div className="flex flex-col items-center justify-center gap-2">
          {pageMetadataIsLoading && <LoadingCircle />}
          {pageMetadata && (
            <div className="flex h-[200px] max-w-[500px] flex-col items-center justify-center gap-2">
              <PageItemCard pageItem={pageMetadata as PageItem} />
            </div>
          )}
        </div>
      )}

      {/*=============================================== IMAGE CARD*/}
      {item && item.type === "image" && (
        <ImageItemCard imageItem={item as ImageItem} />
      )}

      {/*=============================================== DOCUMENT CARD*/}
      {item && item.type === "document" && (
        <DocumentItemCard documentItem={item as DocumentItem} />
      )}

      {/*=============================================== METADATA CARD*/}
      {urlMetadataIsLoading && <LoadingCircle />}
      {item && (
        <div className="flex w-full flex-col items-center justify-center gap-2">
          <p>metadata:</p>
          <Card className="w-full bg-slate-100 p-4">
            <pre className="overflow-auto">{JSON.stringify(item, null, 2)}</pre>
          </Card>
        </div>
      )}
    </main>
  );
}
