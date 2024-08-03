import { Separator } from "./Box";
import dashify from "dashify";
import styles from "./Mdx.module.css";

export const H1 = ({
  children,
  id,
}: {
  children?: React.ReactNode;
  id?: string;
}) => {
  return (
    <>
      <h2
        className={styles.heading1}
        id={
          id ? id : typeof children === "string" ? dashify(children) : undefined
        }
      >
        {children}
      </h2>
      <Separator width={90} type="double" />
    </>
  );
};

export const H2 = ({
  children,
  id,
}: {
  children?: React.ReactNode;
  id?: string;
}) => {
  return (
    <>
      <h3
        className={styles.heading2}
        id={
          id ? id : typeof children === "string" ? dashify(children) : undefined
        }
      >
        {children}
      </h3>
    </>
  );
};

export const H3 = ({ children }: { children?: React.ReactNode }) => {
  return <h4 className={styles.heading3}>{children}</h4>;
};

export const Paragraph = ({ children }: { children?: React.ReactNode }) => {
  return <p className={styles.paragraph}>{children}</p>;
};

export const ExternalLink = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
}) => {
  return (
    <a
      className={styles.externalLink}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      {children}
    </a>
  );
};

export const ListItem = ({ children }: { children?: React.ReactNode }) => {
  return <li className={styles.listItem}>{children}</li>;
};

export const Timeframe = ({ children }: { children?: React.ReactNode }) => {
  return (
    <>
      <span className={styles.timeframe}>{children}</span>
      <Separator width={90} type="single" />
    </>
  );
};
