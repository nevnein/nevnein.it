import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";
import { MainContainer } from "./MainContainer";
import { Separator } from "./Separator";
import styles from "./Footer.module.css";
import clsx from "clsx";

export const Footer = ({ locale }: { locale: string }) => {
  unstable_setRequestLocale(locale);

  const t = useTranslations("HomePage");

  return (
    <MainContainer>
      <div className={clsx(styles.footerContainer, "print-hidden")}>
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
    </MainContainer>
  );
};
