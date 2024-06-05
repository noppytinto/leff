import { NextRequest } from "next/server";
// import { CheerioAPI, load } from "cheerio";
// import { isValidURL } from "../../../utils/utils";
// import jsdom from "jsdom";
// import { Readability } from "@mozilla/readability";
// import puppeteer from "puppeteer";
// import PCR from "puppeteer-chromium-resolver";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const netlifyFunctionsUrl = process.env.NETLIFY_FUNCTIONS_URL;
  const remoteApiUrl = process.env.API_URL;
  console.log(
    "fffffffffffffffffffffffffffffffffffffffffff netlifyFunctionsUrl:",
    netlifyFunctionsUrl,
  );
  const givenUrl = searchParams.get("url");
  const apiUrl = `${netlifyFunctionsUrl}/page-meta?url=${givenUrl}`;
  const apiUrl2 = `${remoteApiUrl}/page-meta?url=${givenUrl}`;

  try {
    const response = await fetch(apiUrl2, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    if (!response.ok) {
      console.error(
        "fffffffffffffffffffffffffffffffffffffffffff ERROR fetching page metadata:",
        response.statusText,
      );

      return Response.json({
        title: "",
        description: "",
        image: "",
        favicon: "",
        error: true,
        errorMessage: response.statusText,
      });
    }

    return Response.json({
      title: data.title,
      description: data.description,
      image: data.image,
      favicon: data.favicon,
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
      errorMessage: String(error),
    });
  }

  //   const sanitizedUrl = sanitizeUrl(searchParams.get("url"));
  //   const baseUrl = new URL(sanitizedUrl).origin;

  //   try {
  //     const response = await fetch(sanitizedUrl, {
  //       headers: {
  //         "User-Agent":
  //           "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
  //       },
  //     });

  //     if (!response.ok) {
  //       // if Forbidden,
  //       // because for example
  //       // the page is dynamic and requires JavaScript to render
  //       console.log(
  //         "fffffffffffffffffffffffffffffffffffffffffff response.status :",
  //         response.status,
  //       );
  //       if (response.status === 403) {
  //         console.log(
  //           "fffffffffffffffffffffffffffffffffffffffffff using puppeteer",
  //         );
  //         const pageContent = await getPageContentWithPuppeteer(sanitizedUrl);
  //         const $ = load(pageContent);

  //         return Response.json({
  //           title: getTitle($),
  //           description: getDescription($),
  //           image: getImageSrc($, baseUrl),
  //           favicon: getFaviconSrc(baseUrl),
  //           html: pageContent,
  //           error: false,
  //           errorMessage: "",
  //         });
  //       }

  //       // if any other error
  //       return Response.json({
  //         title: "",
  //         description: "",
  //         image: "",
  //         favicon: "",
  //         error: true,
  //         errorMessage: String("ERROR" + response.statusText),
  //       });
  //     }

  //     // get page metadata using cheerio
  //     const html = await response.text();
  //     const $ = load(html);

  //     return Response.json({
  //       title: getTitle($),
  //       description: getDescription($),
  //       image: getImageSrc($, baseUrl),
  //       favicon: getFaviconSrc(baseUrl),
  //       html,
  //       error: false,
  //       errorMessage: "",
  //     });
  //   } catch (error) {
  //     console.error(
  //       "fffffffffffffffffffffffffffffffffffffffffff ERROR fetching page metadata:",
  //       error,
  //     );

  //     return Response.json({
  //       title: "",
  //       description: "",
  //       image: "",
  //       favicon: "",
  //       error: true,
  //       errorMessage: String(error),
  //     });
  //   }
}

// /**
//  * Only use this function
//  * if the page is dynamic and requires JavaScript to render
//  * @param url
//  */
// const getPageContentWithPuppeteer = async (url: string) => {
//   // resolve puppeteer chromium path
//   const stats = await PCR({});

//   console.log(
//     "fffffffffffffffffffffffffffffffffffffffffff stats:",
//     stats.executablePath,
//   );

//   // get page content using puppeteer in headless mode
//   const browser = await puppeteer.launch({
//     headless: "new", // use new headless mode (recommended)
//     executablePath: stats.executablePath,
//   });

//   const page = await browser.newPage();
//   // await page.setViewport({ width: 1920, height: 1080 });
//   await page.goto(url);
//   // await page.waitForNetworkIdle(); // Wait for network resources to fully load
//   const pageData = await page.content();
//   await browser.close();

//   return pageData;
// };

// function getImageSrc($: CheerioAPI, baseUrl: string) {
//   const cheerioSrc =
//     $('meta[property="og:image"]').attr("content") ||
//     $('meta[name="twitter:image"]').attr("content") ||
//     // itemprop="image" is used by Google
//     $('meta[itemprop="image"]').attr("content") ||
//     // other sources
//     $('link[rel="apple-touch-icon"]').attr("href");

//   let finalImageSrc = "";
//   if (!cheerioSrc) {
//     return "";
//   }
//   if (cheerioSrc.startsWith("/")) {
//     finalImageSrc = baseUrl + cheerioSrc;
//   } else if (isValidURL(cheerioSrc)) {
//     finalImageSrc = cheerioSrc;
//   }

//   return finalImageSrc;
// }

// function getFaviconSrc(baseUrl: string) {
//   // const favicon = $('link[rel="icon"]').attr("href");
//   // if (!favicon) {
//   //   const googleFavicon = "https://www.google.com/s2/favicons?domain=" + baseUrl;
//   //   return googleFavicon;
//   // }

//   console.log("fffffffffffffffffffffffffffffffffffffffffff baseUrl:", baseUrl);

//   return new URL("https://www.google.com/s2/favicons?domain=" + baseUrl).href;
// }

// function getTitle($: CheerioAPI) {
//   return $('meta[property="og:title"]').attr("content") || $("title").text();
// }

// function getDescription($: CheerioAPI) {
//   const cheerioDescription =
//     $('meta[property="og:description"]').attr("content") ||
//     $('meta[name="description"]').attr("content");

//   let finalDescription = cheerioDescription;

//   // try to get description using Mozilla Readability
//   if (!cheerioDescription) {
//     const jsDoc = new jsdom.JSDOM($.html());
//     const doc = jsDoc.window.document; // transform jsdom document to dom document
//     const reader = new Readability(doc);
//     const article = reader.parse();
//     finalDescription = article?.excerpt;
//   }

//   return finalDescription || "";
// }

// function maybeAddUrlDomain(url: string, domain: string) {
//   // if url has no domain, add domain
//   // e.g. /about -> https://example.com/about
//   if (url.startsWith("/")) {
//     return domain + url;
//   }

//   return url;
// }

// function maybeAddBaseUrl(url: string, baseUrl: string) {
//   // if url has no domain, add domain
//   // e.g. /about -> https://example.com/about
//   if (url.startsWith("/")) {
//     return baseUrl + url;
//   }

//   return url;
// }

// function sanitizeUrl(url: string) {
//   // trim and remove trailing slash
//   const trimmedUrl = new URL(url).href;
//   return trimmedUrl.replace(/\/$/, "");
// }

// // function maybeDecodeUrl(url: string) {
// //   try {
// //     return decodeURIComponent(url);
// //   } catch (error) {
// //     return url;
// //   }
// // }
