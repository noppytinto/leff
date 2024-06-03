"use client";

import React from "react";
import { isValidURL, maybeAddScheme } from "../utils/utils";
import { parseURL } from "../entities/urlData";
// import styles from "./App.module.scss";

export default function Home() {
  const [url, setUrl] = React.useState("");
  const urlInputRef = React.useRef<HTMLInputElement>(null);
  const [isUrlValid, setIsUrlValid] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [urlData, setUrlData] = React.useState("");

  function onUrlChange(event: React.ChangeEvent<HTMLInputElement>) {
    let url = event.currentTarget.value;

    const isValid = isValidURL(url);
    if (!isValid) {
      setErrorMessage("Please enter a valid URL");
      setUrlData("");
    } else {
      url = maybeAddScheme(url);
      setErrorMessage("");
      const data = parseURL(url);
      setUrlData(JSON.stringify(data, null, 2));
    }

    setUrl(url);
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
          onChange={onUrlChange}
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
