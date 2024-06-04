const BASE_URL = "https://restcountries.com";
const API_VERSION = "v3.1";
export const SEGMENT_ALL = "all";
export const SEGMENT_NAME = "name";

export const buildUrl = (...path: string[]) => {
  return `${BASE_URL}/${API_VERSION}/${path.join("/")}`;
};

export function buildQuery(query: string) {}

export function debounce(fn: Function, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout>;

  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const urlPattern = new RegExp(
  /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(:\d{1,5})?(\/[^?#]*)*(\?([^#]*))?(#.*)?$/i,
);
const urlPattern2 = new RegExp(
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
);

export function isValidURL(url: string) {
  if (!url) {
    return false;
  }

  if (!url.match(urlPattern)) {
    return false;
  }

  return url.match(urlPattern)[0] === url;
}

const httpsPattern = new RegExp(/^https:\/\//i);

export function isURLSecure(url: string) {
  return httpsPattern.test(url);
}

function hasScheme(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Attempts to add a scheme to a URL
 * if it doesn't have one
 *
 * @param url
 * @returns
 */
export function maybeAddScheme(url: string) {
  return hasScheme(url) ? url : `https://${url}`;
}
