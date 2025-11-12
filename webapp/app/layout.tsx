import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stormbound Visions",
  description:
    "Cinematic camera journey unveiling a statue through mist, lightning, and distant thunder."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
