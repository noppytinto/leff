import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.scss";
// import styles from "./layout.module.scss";
import React from "react";

const font = Poppins({ subsets: ["latin"], weight: ["400", "600"] });

export const metadata: Metadata = {
  title: "Leff",
  description: "Leff - your companion organizer app",
  appleWebApp: {
    title: "Leff",
    capable: true,
    statusBarStyle: "black-translucent",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  // userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={font.className}>
          {children}

      </body>
    </html>
  );
}
