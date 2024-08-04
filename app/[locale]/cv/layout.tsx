import { Box, Separator } from "@/components/Box";
import { Link } from "@/navigation";
import styles from "./layout.module.css";
import { Metadata } from "next";
import { unstable_setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { PrintButton } from "@/components/PrintButton";
import { getMetadata } from "@/app/utils/getMetadata";
import { locales } from "@/config";

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return getMetadata(locale, "CV");
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export default function CvLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  unstable_setRequestLocale(params.locale);
  const t = useTranslations("CV");

  return (
    <div className={styles.container}>
      <Box width={90} height={4} type="single">
        <h1
          style={{
            textTransform: "uppercase",
            textAlign: "center",
            fontWeight: "bold",
            marginTop: "var(--line)",
          }}
        >
          Adam Di Mario
        </h1>
        <p style={{ textAlign: "center" }}>Web Developer</p>
      </Box>
      <div className={styles.contacts}>
        <a href="mailto:nev9adam@gmail">nev9adam@gmail.com</a>
        <a href="tel:+393207117228">+39 320 7117 228</a>
      </div>
      <div className={styles.tocRail}>
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
  );
}
