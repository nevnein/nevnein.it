import { use } from "react";
import { Separator } from "@/components/Separator";
import { Link } from "@/navigation";
import styles from "./layout.module.css";
import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PrintButton } from "@/components/PrintButton";
import { getMetadata } from "@/app/utils/getMetadata";
import { locales } from "@/config";
import { MainContainer } from "@/components/MainContainer";
import * as Grid from "@/components/Grid";
import clsx from "clsx";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;

  const { locale } = params;

  const basicMetadata = await getMetadata(locale, "CV");
  return {
    ...basicMetadata,
    alternates: {
      languages: Object.fromEntries(
        locales.map((locale) => [locale, `https://nevnein.it/${locale}/cv`])
      ),
    },
  };
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default function CvLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
  }>
) {
  const params = use(props.params);

  const { children } = props;

  unstable_setRequestLocale(params.locale);
  const t = useTranslations("CV");

  return (
    <MainContainer>
      <div className={styles.container}>
        <Breadcrumbs links={[{ label: "Curriculum Vitæ", link: "/cv" }]} />
        <Grid.GridProvider>
          <Grid.Content>
            <div style={{ padding: "var(--line) 0" }}>
              <h1
                style={{
                  textTransform: "uppercase",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Adam Di Mario
              </h1>
              <p style={{ textAlign: "center" }}>Web Developer</p>
            </div>
          </Grid.Content>
        </Grid.GridProvider>
        <div className={styles.contacts}>
          <a href="mailto:nev9adam@gmail">nev9adam@gmail.com</a>
          <a href="tel:+393207117228">+39 320 7117 228</a>
        </div>
        <div className={clsx(styles.tocRail, "print-hidden")}>
          <div className={styles.toc}>
            <h2>{t("toc")}</h2>
            <Separator width={90} type="double" />
            <ul className={styles.index}>
              <li>
                <Link href="#tl-dr">tl:dr;</Link>
              </li>
              <Separator width={90} type="single" />
              <li>
                <Link href="#esperienze-lavorative">{t("experience")}</Link>
                <ul className={styles.index}>
                  <li>
                    <a href="#work-at-modo">Lead frontend @MODO</a>
                  </li>
                  <li>
                    <a href="#work-at-5a">Frontend @5A Design</a>
                  </li>
                  <li>
                    <a href="#work-at-unisono">Junior @Unisono</a>
                  </li>
                  <li>
                    <a href="#freelance">Freelance</a>
                  </li>
                </ul>
              </li>
              <Separator width={90} type="single" />
              <li>
                <Link href="#skillset">{t("skillset")}</Link>
                <ul className={styles.index}>
                  <li>
                    <a href="#core">{t("core")}</a>
                  </li>
                  <li>
                    <a href="#auxiliary">{t("auxiliary")}</a>
                  </li>
                  <li>
                    <a href="#soft">{t("soft")}</a>
                  </li>
                </ul>
              </li>
              <Separator width={90} type="single" />
              <li>
                <Link href="#others">{t("others")}</Link>
                <ul className={styles.index}>
                  <li>
                    <a href="#currently-studying">{t("studying")}</a>
                  </li>
                </ul>
              </li>
            </ul>
            <Separator width={90} type="single" />
            <h2 style={{ marginTop: "var(--line)" }}>{t("utils")}</h2>
            <Separator width={90} type="double" />
            <ul className={styles.index}>
              <li>
                <PrintButton>{t("print")}</PrintButton>
              </li>
              <li>
                <Link href="/cv" locale={params.locale === "en" ? "it" : "en"}>
                  {t("locale")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {children}
      </div>
    </MainContainer>
  );
}
