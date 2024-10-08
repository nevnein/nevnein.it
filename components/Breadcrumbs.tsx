import { Link } from "@/navigation";
import styles from "./Breadcrumbs.module.css";
import { Graphic } from "./Graphic";

export const Breadcrumbs = ({
  links,
}: {
  links: { link: string; label: string }[];
}) => {
  const current = links[links.length - 1];

  return (
    <nav aria-label="Breadcrumbs" className="print-hidden">
      <ul className={styles.breadcrumbs}>
        <li>
          <Link href="/">Home</Link>
        </li>
        {links.map(({ label, link }) => (
          <li key={label}>
            <Graphic inline>{"> "}</Graphic>
            <Link
              href={link}
              aria-current={link === current.link ? "page" : undefined}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
