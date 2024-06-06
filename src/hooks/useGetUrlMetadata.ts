import React, { useEffect, useState } from "react";
import { URLMetadataResponse } from "../app/api/url-meta/route";
import { URLMetadata } from "../types/URLMetadata";

const BASE_API_URL_META_URL = "/api/url-meta";

export function useGetUrlMetadata(url: string | null) {
  const [metadata, setMetadata] = useState<URLMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isError, setIsError] = React.useState(false);

  useEffect(() => {
    if (!url) {
      return;
    }

    const ac = new AbortController();

    (async () => {
      setIsLoading(true);
      setMetadata(null);
      setIsError(false);
      setErrorMessage("");

      const apiUrl = BASE_API_URL_META_URL + "?url=" + url;
      const response = await fetch(apiUrl, { signal: ac.signal });

      if (ac.signal.aborted) return;

      if (!response.ok) {
        setIsError(true);
        setErrorMessage("Error fetching URL metadata: " + response.statusText);
        setIsLoading(false);
        return;
      }

      const data: URLMetadataResponse = await response.json();

      if (data.hasFailed) {
        setIsError(true);
        setErrorMessage("Error fetching URL metadata: " + data.errorMessage);
        setIsLoading(false);
        return;
      }

      setMetadata({
        fullUrl: data.fullUrl,
        scheme: data.scheme,
        host: data.host,
        port: data.port,
        path: data.path,
        query: data.query,
        fragment: data.fragment,
        isSecure: data.isSecure,
      });

      setIsLoading(false);
    })();

    // TODO: investigate if this is necessary, at the moment causes a an unusual abort
    // return () => {
    //   ac.abort();
    // };
  }, [url]);

  return { metadata, isLoading, isError, errorMessage };
}
