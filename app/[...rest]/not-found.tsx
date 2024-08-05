import { Separator } from "@/components/Box";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <html lang="en">
      <body>
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
          <h1 style={{ fontWeight: "bold" }}>404</h1>
          <Separator width={20} type="double" />
          <Link href="/">Home</Link>
        </div>
      </body>
    </html>
  );
}
