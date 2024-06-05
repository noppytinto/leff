import { PageMetaResponse } from "../app/api/page-meta/route";

const BASE_API_PAGE_META_URL = "/api/page-meta";

export type PageMetadata = {
  title?: string;
  description?: string;
  image?: string;
  favicon?: string;
};

export const getPageMetadata = async (
  url: string,
): Promise<PageMetaResponse> => {
  const apirUrl = BASE_API_PAGE_META_URL + "?url=" + url;

  try {
    const response = await fetch(apirUrl);

    console.log(
      "fffffffffffffffffffffffffffffffffffffffffff response:",
      response,
    );

    if (!response.ok) {
      console.error(
        "fffffffffffffffffffffffffffffffffffffffffff ERROR response not ok:",
        response.statusText,
      );

      return {
        hasFailed: true,
        errorMessage: response.statusText,
        statusCode: response.status,
      };
    }

    const data = await response.json();

    if (data.hasFailed) {
      return {
        hasFailed: true,
        errorMessage: data.errorMessage,
      };
    }

    return {
      title: data.title,
      description: data.description,
      image: data.image,
      favicon: data.favicon,
    };
  } catch (error) {
    console.error(
      "fffffffffffffffffffffffffffffffffffffffffff ERROR fetching page metadata:",
      error,
    );

    return {
      hasFailed: true,
      errorMessage: String(error),
    };
  }
};
