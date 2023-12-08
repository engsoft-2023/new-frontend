import Head from "next/head";

export const Header = ({
  title,
  description = "A tool to characterize the architecture of service-based systems",
}: any) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
