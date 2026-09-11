import type { Metadata } from "next";

const siteName = "Mecellino Haven";

export function publicPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const openGraphTitle = `${title} | ${siteName}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: openGraphTitle,
      description,
      url: path,
      siteName,
      type: "website",
    },
  };
}
