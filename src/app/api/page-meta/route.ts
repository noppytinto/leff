import { NextRequest } from "next/server";
import { CheerioAPI, load } from "cheerio";
import { isValidURL } from "../../../utils/utils";
import jsdom from "jsdom";
import { Readability } from "@mozilla/readability";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sanitizedUrl = sanitizeUrl(searchParams.get("url"));
  const baseUrl = new URL(sanitizedUrl).origin;

  try {
    const pageData = await fetch(sanitizedUrl, {
      headers: {
        "Content-Type": "text/html",
      },
    });

    if (!pageData.ok) {
      console.error(
        "fffffffffffffffffffffffffffffffffffffffffff ERROR fetching page metadata:",
        pageData.statusText,
      );

      return Response.json({
        title: "",
        description: "",
        image: "",
        favicon: "",
        error: true,
      });
    }

    // get page metadata using cheerio
    const html = await pageData.text();
    const $ = load(html);

    return Response.json({
      title: getTitle($),
      description: getDescription($),
      image: getImageSrc($, baseUrl),
      favicon: getFaviconSrc(baseUrl),
      html,
      error: false,
    });
  } catch (error) {
    console.error(
      "fffffffffffffffffffffffffffffffffffffffffff ERROR fetching page metadata:",
      error,
    );

    return Response.json({
      title: "",
      description: "",
      image: "",
      favicon: "",
      error: true,
    });
  }
}

function getImageSrc($: CheerioAPI, baseUrl: string) {
  const cheerioSrc =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[name="twitter:image"]').attr("content") ||
    // itemprop="image" is used by Google
    $('meta[itemprop="image"]').attr("content") ||
    // other sources
    $('link[rel="apple-touch-icon"]').attr("href");

  let finalImageSrc = "";
  if (!cheerioSrc) {
    return "";
  }
  if (cheerioSrc.startsWith("/")) {
    finalImageSrc = baseUrl + cheerioSrc;
  } else if (isValidURL(cheerioSrc)) {
    finalImageSrc = cheerioSrc;
  }

  return finalImageSrc;
}

function getFaviconSrc(baseUrl: string) {
  // const favicon = $('link[rel="icon"]').attr("href");
  // if (!favicon) {
  //   const googleFavicon = "https://www.google.com/s2/favicons?domain=" + baseUrl;
  //   return googleFavicon;
  // }

  console.log("fffffffffffffffffffffffffffffffffffffffffff baseUrl:", baseUrl);

  return new URL("https://www.google.com/s2/favicons?domain=" + baseUrl).href;
}

function getTitle($: CheerioAPI) {
  return $('meta[property="og:title"]').attr("content") || $("title").text();
}

function getDescription($: CheerioAPI) {
  const cheerioDescription =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content");

  let finalDescription = cheerioDescription;

  // try to get description using Mozilla Readability
  if (!cheerioDescription) {
    const jsDoc = new jsdom.JSDOM($.html());
    const doc = jsDoc.window.document; // transform jsdom document to dom document
    const reader = new Readability(doc);
    const article = reader.parse();
    finalDescription = article?.excerpt;
  }

  return finalDescription || "";
}

function maybeAddUrlDomain(url: string, domain: string) {
  // if url has no domain, add domain
  // e.g. /about -> https://example.com/about
  if (url.startsWith("/")) {
    return domain + url;
  }

  return url;
}

function maybeAddBaseUrl(url: string, baseUrl: string) {
  // if url has no domain, add domain
  // e.g. /about -> https://example.com/about
  if (url.startsWith("/")) {
    return baseUrl + url;
  }

  return url;
}

function sanitizeUrl(url: string) {
  // trim and remove trailing slash
  const dirtyUrl = url.trim().replace(/\/$/, "");
  return new URL(dirtyUrl).href;
}

// function maybeDecodeUrl(url: string) {
//   try {
//     return decodeURIComponent(url);
//   } catch (error) {
//     return url;
//   }
// }
