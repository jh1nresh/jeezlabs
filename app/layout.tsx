import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const news = Newsreader({
  variable: "--font-news",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "jeezlabs - product index",
  description:
    "A two-person product lab building internet software, protocol experiments, and small tools in public.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${mono.variable} ${serif.variable} ${news.variable}`}>
      <body>{children}</body>
    </html>
  );
}
