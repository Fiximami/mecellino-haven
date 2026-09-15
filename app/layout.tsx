import type { Metadata } from "next";
import { IBM_Plex_Mono, Libre_Franklin, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Mecellino Haven | Capacity, coaching and experiences",
    template: "%s | Mecellino Haven",
  },
  description:
    "Mecellino Haven builds individual and institutional capacity through practical training, Youth Discovery Gateway programmes, lifestyle coaching, and inclusive events and entertainment, while developing safe amusement experiences.",
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  keywords: [
    "Mecellino Haven",
    "Capacity Building",
    "Youth Discovery Gateway",
    "YDG",
    "Lifestyle Coaching",
    "Events and Entertainment",
    "Amusement",
    "Ghana",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sourceSerif.variable} ${libreFranklin.variable} ${ibmPlexMono.variable} flex min-h-screen flex-col antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
