import localFont from "next/font/local";

export const BerkeleyMono = localFont({
  src: [
    {
      path: "./../fonts/BerkeleyMono-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "./../fonts/BerkeleyMono-Italic.woff2",
      style: "italic",
      weight: "400",
    },
    {
      path: "./../fonts/BerkeleyMono-Bold.woff2",
      style: "normal",
      weight: "600",
    },
    {
      path: "./../fonts/BerkeleyMono-BoldItalic.woff2",
      style: "italic",
      weight: "600",
    },
  ],
  display: "swap",
  variable: "--font-code",
});
