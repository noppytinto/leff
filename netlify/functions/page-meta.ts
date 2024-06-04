import { CheerioAPI, load } from "cheerio";
import puppeteer from "puppeteer-core";
import jsdom from "jsdom";
import { Readability } from "@mozilla/readability";
// import PCR from "puppeteer-chromium-resolver";
import { isValidURL } from "../../src/utils/utils";
import chromium from "@sparticuz/chromium";

export const handler = async (event, context) => {
  // get params
  const { url } = event.queryStringParameters;
  console.log("url", url);

  const sanitizedUrl = sanitizeUrl(url);
  const baseUrl = new URL(sanitizedUrl).origin;

  try {
    const response = await fetch(sanitizedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      },
    });

    if (!response.ok) {
      // if Forbidden,
      // because for example
      // the page is dynamic and requires JavaScript to render
      if (response.status === 403) {
        console.log(
          "fffffffffffffffffffffffffffffffffffffffffff using puppeteer",
        );
        const pageContent = await getPageContentWithPuppeteer(sanitizedUrl);
        const $ = load(pageContent);

        return {
          statusCode: 200,
          body: JSON.stringify({
            title: getTitle($),
            description: getDescription($),
            image: getImageSrc($, baseUrl),
            favicon: getFaviconSrc(baseUrl),
            html: pageContent,
            error: false,
            errorMessage: "",
          }),
        };
      }

      // if any other error
      return {
        statusCode: 200,
        body: JSON.stringify({
          title: "",
          description: "",
          image: "",
          favicon: "",
          error: true,
          errorMessage: String("ERROR" + response.statusText),
        }),
      };
    }

    // get page metadata using cheerio
    const html = await response.text();
    const $ = load(html);

    return {
      statusCode: 200,
      body: JSON.stringify({
        title: getTitle($),
        description: getDescription($),
        image: getImageSrc($, baseUrl),
        favicon: getFaviconSrc(baseUrl),
        html,
        error: false,
        errorMessage: "",
      }),
    };
  } catch (error) {
    console.error(
      "fffffffffffffffffffffffffffffffffffffffffff ERROR fetching page metadata:",
      error,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        title: "",
        description: "",
        image: "",
        favicon: "",
        error: true,
        errorMessage: String(error),
      }),
    };
  }
};

/**
 * Only use this function
 * if the page is dynamic and requires JavaScript to render
 * @param url
 */
const getPageContentWithPuppeteer = async (url: string) => {
  // Optional: If you'd like to use the new headless mode. "shell" is the default.
  // NOTE: Because we build the shell binary, this option does not work.
  //       However, this option will stay so when we migrate to full chromium it will work.
  chromium.setHeadlessMode = true;

  // Optional: If you'd like to disable webgl, true is the default.
  // chromium.setGraphicsMode = false;

  // resolve puppeteer chromium path
  // const stats = await PCR({});
  //
  // console.log(
  //   "fffffffffffffffffffffffffffffffffffffffffff stats:",
  //   stats.executablePath,
  // );

  console.log("fffffffffffffffffffffffffffffffffffffffffff pup url:", url);

  const executablePath = await chromium.executablePath();

  console.log(
    "fffffffffffffffffffffffffffffffffffffffffff executablePath:",
    executablePath,
  );

  // get page content using puppeteer in headless mode
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: chromium.headless,
  });

  const page = await browser.newPage();
  // await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(url);
  // await page.waitForNetworkIdle(); // Wait for network resources to fully load
  const pageData = await page.content();
  await browser.close();

  return pageData;
};

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

function sanitizeUrl(url: string) {
  // trim and remove trailing slash
  const trimmedUrl = new URL(url).href;
  return trimmedUrl.replace(/\/$/, "");
}
