import { defaultLocale, locales } from "@/config";
import { MetadataRoute } from "next";

const pathnames = ["/", "/cv"];
const host = "https://nevnein.it";

export default function sitemap(): MetadataRoute.Sitemap {
  function getUrl(pathname: string, locale: string) {
    return `${host}/${locale}${pathname === "/" ? "" : pathname}`;
  }

  return pathnames.map((pathname) => ({
    url: getUrl(pathname, defaultLocale),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, getUrl(pathname, locale)])
      ),
    },
  }));
}
