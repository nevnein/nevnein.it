import type { Metadata } from "next";
import styles from "./layout.module.css";
import { getMetadata } from "../utils/getMetadata";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { locales } from "@/config";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadata(locale, "HomePage");
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale}>
      <SpeedInsights />
      <body style={{ position: "relative" }}>
        <main className={styles.mainContainer}>{children}</main>
      </body>
    </html>
  );
}
