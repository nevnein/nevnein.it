import { notFound } from "next/navigation";

export default async function Cv({
  params: { locale },
}: {
  params: { locale: string };
}) {
  try {
    const Content = (await import(`./${locale}.mdx`)).default;
    return <Content />;
  } catch (error) {
    console.log(error);
    notFound();
  }
}
