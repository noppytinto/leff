"use client";

import React from "react";
import { isValidURL, maybeAddScheme } from "../utils/utils";
import { parseURL } from "../entities/urlData";
// import styles from "./App.module.scss";

import debounce from "lodash/debounce";

export default function Home() {
  const [url, setUrl] = React.useState("");
  const urlInputRef = React.useRef<HTMLInputElement>(null);
  const [isUrlValid, setIsUrlValid] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [urlData, setUrlData] = React.useState("");

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

  return (
    <main className="flex h-lvh flex-col items-center justify-center gap-4 p-3">
      <pre>{urlData}</pre>
      <form
        onSubmit={onFormSubmit}
        className="flex flex-col items-center justify-center gap-2"
        noValidate
      >
        <label htmlFor="url">paste your url here</label>
        <input
          id="url"
          name="url"
          type="url"
          className=" h-12 w-96 rounded border border-solid border-gray-700 px-4 py-2"
          onChange={debounce((event) => {
            console.log(event);
            handleUrlChange(event.target.value);
          }, 500)}
        />

        {!isUrlValid && (
          <p className="text-red-500">
            {errorMessage || "Please enter a valid URL"}
          </p>
        )}

        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
