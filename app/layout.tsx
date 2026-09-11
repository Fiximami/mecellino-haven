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
    default: "Mecellino Haven | Youth Discovery Gateway",
    template: "%s | Mecellino Haven",
  },
  description:
    "Mecellino Haven works with children, young people and families in Ghana — through mobile amusement and the Youth Discovery Gateway programme.",
  keywords: [
    "Youth Discovery Gateway",
    "YDG",
    "Mecellino Haven",
    "Ghana youth programme",
    "mobile amusement",
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
