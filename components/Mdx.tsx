import { Separator } from "./Separator";
import dashify from "dashify";
import styles from "./Mdx.module.css";
import { Autofill } from "./Grid";
import { BORDERS } from "./utils";
import { deepMap } from "react-children-utilities";
import { jsx, jsxs } from "react/jsx-runtime";
import { Tooltip, TooltipContent, TooltipTrigger } from "./Tooltip";
import clsx from "clsx";
import React, { isValidElement } from "react";

export const CvH1 = ({
  children,
  id,
}: {
  children?: React.ReactNode;
  id?: string;
}): React.ReactElement => {
  return (
    <>
      <h2
        className={clsx(styles.heading, styles.cvHeading1)}
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

export const H1 = ({
  children,
  id,
}: {
  children?: React.ReactNode;
  id?: string;
}): React.ReactElement => {
  return (
    <>
      <h2
        className={styles.heading}
        id={
          id ? id : typeof children === "string" ? dashify(children) : undefined
        }
      >
        {children}
        <Separator width={90} type="single" />
      </h2>
    </>
  );
};

export const CvH2 = ({
  children,
  id,
}: {
  children?: React.ReactNode;
  id?: string;
}) => {
  return (
    <>
      <h3
        className={clsx(styles.heading, styles.cvHeading2)}
        id={
          id ? id : typeof children === "string" ? dashify(children) : undefined
        }
      >
        {children}
      </h3>
    </>
  );
};

export const H2 = ({ children }: { children?: React.ReactNode }) => {
  return <h3 className={styles.smallHeading}>{children}</h3>;
};

export const CvH3 = ({ children }: { children?: React.ReactNode }) => {
  return <h4 className={styles.heading}>{children}</h4>;
};

export const H3 = ({ children }: { children?: React.ReactNode }) => {
  return <h4 className={styles.heading}>{children}</h4>;
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
    <a rel="noreferrer" target="_blank" {...props}>
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

export const Blockquote = ({ children }: { children?: React.ReactNode }) => {
  return (
    <blockquote className={styles.blockquote}>
      <Autofill direction="v" filler={BORDERS.double.v} />
      <div>{children}</div>
    </blockquote>
  );
};

export const UnorderedList = ({ children }: { children?: React.ReactNode }) => {
  return <ul className={styles.list}>{children}</ul>;
};

export const Code = ({
  children,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const newChildren = deepMap(children, (child) => {
    if (
      isValidElement<{ className: string; children: React.ReactNode[] }>(child)
    ) {
      if (child.type === "span" && child.props.className === "twoslash-hover") {
        const newChild = jsxs(Tooltip, {
          className: child.props.className,
          children: [
            jsx(TooltipContent, {
              children: child.props.children[0],
            }),
            jsx(TooltipTrigger, {
              children: child.props.children[1],
            }),
          ],
        });

        return newChild;
      }

      if (
        child.type === "span" &&
        child.props.className === "twoslash-hover twoslash-query-presisted"
      ) {
        const newChild = jsxs(Tooltip, {
          className: child.props.className,
          open: true,
          children: [
            jsx(TooltipContent, {
              children: child.props.children[0],
            }),
            jsx(TooltipTrigger, {
              children: child.props.children[1],
            }),
          ],
        });

        return newChild;
      }
    }
    return child;
  });

  return (
    <pre className={props.className} style={props.style}>
      {newChildren}
    </pre>
  );
};
