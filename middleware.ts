import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./config";

export default createMiddleware({
  locales,
  defaultLocale,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)", "/(it|en)/:path*"],
};
