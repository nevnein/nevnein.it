import localFont from "next/font/local";

export const BerkeleyMono = localFont({
  src: [
    {
      path: "../../public/BerkeleyMono-Regular.woff2",
      style: "normal",
      weight: "400",
    },
    {
      path: "../../public/BerkeleyMono-Italic.woff2",
      style: "italic",
      weight: "400",
    },
    {
      path: "../../public/BerkeleyMono-Bold.woff2",
      style: "normal",
      weight: "600",
    },
    {
      path: "../../public/BerkeleyMono-BoldItalic.woff2",
      style: "italic",
      weight: "600",
    },
  ],
  display: "swap",
});
