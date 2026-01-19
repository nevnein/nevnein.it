import { defaultLocale, host, locales, pathnames } from "@/config";
import { readdir } from "fs/promises";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  function getUrl(pathname: string, locale: string) {
    return `${host}/${locale}${pathname === "/" ? "" : pathname}`;
  }

  const noteSlugs = (
    await readdir("./app/[locale]/notes/[note]", { withFileTypes: true })
  )
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => `/notes/${dirent.name}`);

  return [...pathnames, ...noteSlugs].map((pathname) => ({
    url: getUrl(pathname, defaultLocale),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, getUrl(pathname, locale)]),
      ),
    },
  }));
}
