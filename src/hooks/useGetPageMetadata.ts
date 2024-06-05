import React, { useEffect } from "react";
import { PageMetadata } from "../types/pageMetadata";

const BASE_API_PAGE_META_URL = "/api/page-meta";

export function useGetPageMetadata(url: string | null) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [metadata, setMetadata] = React.useState<PageMetadata | null>(null);

  // fetch page metadata
  useEffect(() => {
    const ac = new AbortController();

    if (!url) return;

    setMetadata(null);
    setErrorMessage("");

    (async () => {
      setIsLoading(true);
      const apiUrl = BASE_API_PAGE_META_URL + "?url=" + url;
      try {
        // pass AbortController.signal to fetch
        const response = await fetch(apiUrl, { signal: ac.signal });

        if (ac.signal.aborted) return;

        if (!response.ok) {
          setErrorMessage(
            "Error fetching page metadata: " + response.statusText,
          );
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        if (data.hasFailed) {
          setErrorMessage("Error fetching page metadata: " + data.errorMessage);
          setIsLoading(false);
          return;
        }

        setMetadata({
          title: data.title,
          description: data.description,
          image: data.image,
          favicon: data.favicon,
        });

        setIsLoading(false);
      } catch (error) {
        setErrorMessage("Error fetching page metadata: " + String(error));
        setIsLoading(false);
      }
    })();

    // return () => {
    //   ac.abort();
    // };
  }, [url]);

  console.log(
    "fffffffffffffffffffffffffffffffffffffffffff metadata:",
    metadata,
  );

  function resetMetadata() {
    setMetadata(null);
  }

  return {
    metadata,
    isLoading,
    errorMessage,
    resetMetadata,
  };
}
