import { HomeHeader } from "@/components/HomeHeader/HomeHeader";
import { MainContainer } from "@/components/MainContainer";
import { locales } from "@/config";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default function Notes({ params }: { params: { locale: string } }) {
  unstable_setRequestLocale(params.locale);
  const t = useTranslations("HomePage");

  return (
    <MainContainer>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "var(--line)",
        }}
      >
        <HomeHeader />
        <p>{t("greeting")}</p>
        <p>{t("intro")}</p>
        <nav
          style={{
            display: "flex",
            columnGap: "6ch",
            rowGap: "var(--line)",
            flexWrap: "wrap",
          }}
        >
          <Link href="/cv">Curriculum Vitæ</Link>
          <Link href="/notes">{t("notes")}</Link>
          <Link href="/" locale={params.locale === "en" ? "it" : "en"}>
            {t("locale")}
          </Link>
        </nav>
      </div>
    </MainContainer>
  );
}
