function maybeAddBaseUrl(url: string, baseUrl: string) {
  // if url has no domain, add domain
  // e.g. /about -> https://example.com/about
  if (url.startsWith("/")) {
    return baseUrl + url;
  }

  return url;
}

export function sanitizeUrl(url: string) {
  // trim and remove trailing slash
  const trimmedUrl = new URL(url).href;
  return trimmedUrl.replace(/\/$/, "");
}

function maybeAddUrlDomain(url: string, domain: string) {
  // if url has no domain, add domain
  // e.g. /about -> https://example.com/about
  if (url.startsWith("/")) {
    return domain + url;
  }

  return url;
}

function maybeDecodeUrl(url: string) {
  try {
    return decodeURIComponent(url);
  } catch (error) {
    return url;
  }
}
