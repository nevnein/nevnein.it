import type { Metadata } from "next";
import { getMetadata } from "../utils/getMetadata";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { locales } from "@/config";
import { getMessages, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { Footer } from "@/components/Footer";
import { BerkeleyMono } from "../utils/BerkeleyMono";
import "./globals.css";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const basicMetadata = await getMetadata(locale, "HomePage");
  return {
    ...basicMetadata,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `https://nevnein.it/${locale}`])
      ),
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }>
) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body style={{ position: "relative" }} className={BerkeleyMono.variable}>
        <div
          aria-hidden
          style={{ width: "1ch", height: "var(--line)" }}
          id="measurer"
        ></div>
        <NextIntlClientProvider messages={messages}>
          {children}
          <Footer locale={locale} />
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
