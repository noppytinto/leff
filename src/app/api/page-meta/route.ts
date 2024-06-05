import { NextRequest } from "next/server";
import { load, CheerioAPI } from "cheerio";
import { isValidURL, makeURLSafe, maybeAddScheme } from "../../../utils/utils";
import jsdom from "jsdom";
import { Readability } from "@mozilla/readability";
import { sanitizeUrl } from "../../../utils/url";
import { BaseApiResponse } from "../../../types/response";
import { PageMetadata } from "../../../types/pageMetadata";
// import puppeteer from "puppeteer";

export type PageMetaResponse = BaseApiResponse & PageMetadata;

export async function GET(req: NextRequest) {
  const searchParams = new URL(req.url).searchParams;
  const urlParam = searchParams.get("url");

  if (!isValidURL(urlParam)) {
    return new Response("Invalid URL", { status: 400 });
  }

  // TODO: fix double call maybeAddScheme in sanitizeUrl and makeURLSafe
  const originalUrl = sanitizeUrl(maybeAddScheme(urlParam));
  const safeUrl = makeURLSafe(originalUrl);
  const baseUrl = new URL(safeUrl).origin;

  try {
    const response = await fetch(safeUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    if (!response.ok) {
      return new Response(String(response.statusText), {
        status: response.status,
      });
    }

    // get page metadata using cheerio
    const html = await response.text();
    const $ = load(html);

    return Response.json({
      title: getTitle($),
      description: getDescription($),
      image: getImageSrc($, baseUrl),
      favicon: getFaviconSrc(baseUrl),
    } satisfies PageMetaResponse);
  } catch (error) {
    console.error(
      "fffffffffffffffffffffffffffffffffffffffffff ERROR fetching page metadata:",
      error,
    );

    return new Response(String(error), { status: 400 });
  }
}

/**
 * Only use this function
 * if the page is dynamic and requires JavaScript to render
 * @param url
 */
// const getPageContentWithPuppeteer = async (url: string) => {
//   // resolve puppeteer chromium path
//   const stats = await PCR({});
//
//   console.log(
//     "fffffffffffffffffffffffffffffffffffffffffff stats:",
//     stats.executablePath,
//   );
//
//   // get page content using puppeteer in headless mode
//   const browser = await puppeteer.launch({
//     headless: "new", // use new headless mode (recommended)
//     executablePath: stats.executablePath,
//   });
//
//   const page = await browser.newPage();
//   // await page.setViewport({ width: 1920, height: 1080 });
//   await page.goto(url);
//   // await page.waitForNetworkIdle(); // Wait for network resources to fully load
//   const pageData = await page.content();
//   await browser.close();
//
//   return pageData;
// };

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
