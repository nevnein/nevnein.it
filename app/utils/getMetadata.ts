import { Metadata } from "next";
import it from "../../messages/it.json";
import { getTranslations } from "next-intl/server";

export async function getMetadata(
  locale: string,
  namespace: keyof typeof it
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
    },
  };
}
