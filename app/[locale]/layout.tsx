import type { Metadata } from "next";
import { getMetadata } from "../utils/getMetadata";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { locales } from "@/config";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const basicMetadata = await getMetadata(locale, "HomePage");
  return locale === "it"
    ? {
        ...basicMetadata,
        alternates: {
          canonical: "https://www.nevnein.it",
        },
      }
    : basicMetadata;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <SpeedInsights />
      <body style={{ position: "relative" }}>
        <div
          aria-hidden
          style={{ width: "1ch", height: "var(--line)" }}
          id="measurer"
        ></div>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
