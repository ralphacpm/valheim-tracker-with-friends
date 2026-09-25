import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mistlands Progression Plan",
  description:
    "A shared Valheim progression tracker for the crew heading into the Mistlands — from Yagluth's death to The Queen.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Spectral:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
