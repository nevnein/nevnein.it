import { locales } from "@/config";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default async function Cv({
  params: { locale },
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);

  try {
    const Content = (await import(`./${locale}.mdx`)).default;
    return <Content />;
  } catch (error) {
    console.log(error);
    notFound();
  }
}
