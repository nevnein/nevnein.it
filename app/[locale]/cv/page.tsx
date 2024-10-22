import { CvH1, CvH2, CvH3 } from "@/components/Mdx";
import { locales } from "@/config";
import { unstable_setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

const overrideComponents = {
  h1: CvH1,
  h2: CvH2,
  h3: CvH3,
};

export default async function Cv(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;

  const {
    locale
  } = params;

  unstable_setRequestLocale(locale);

  try {
    const { default: Content } = await import(`./${locale}.mdx`);
    return <Content components={overrideComponents} />;
  } catch (error) {
    notFound();
  }
}
