export type URLMetadata = {
  fullUrl: string;
  scheme: string;
  host: string;
  port?: string;
  path: string;
  query?: string;
  fragment?: string;
  isSecure: boolean;
};
