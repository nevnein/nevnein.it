import { Box, Separator } from "@/components/Box";
import { locales } from "@/config";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default function LocalizedHome({
  params,
}: {
  params: { locale: string };
}) {
  unstable_setRequestLocale(params.locale);
  const t = useTranslations("HomePage");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--line)",
        minHeight: "100dvh",
      }}
    >
      <header>
        <Box width={90} height={3} type="single">
          <h1
            style={{
              textAlign: "center",
              fontWeight: "bold",
              letterSpacing: "1ch",
              marginTop: "var(--line)",
            }}
          >
            NevNein
          </h1>
        </Box>
      </header>
      <p>{t("greeting")}</p>
      <p>{t("intro")}</p>
      <Link href="/cv">Curriculum Vitæ</Link>
      <Link href="/" locale={params.locale === "en" ? "it" : "en"}>
        {t("locale")}
      </Link>
      <Separator width={20} type="double" />
      <footer>
        <p>
          {t.rich("colophon", {
            license: (chunks) => (
              <a
                target="_blank"
                rel="license noopener noreferrer"
                href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
      </footer>
    </div>
  );
}
