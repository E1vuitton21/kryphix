import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kryphix | The Ultimate Ephemeral Secrecy & Privacy Suite",
  description:
    "Zero-knowledge ephemeral communication suite: self-destructing secret messages, steganography studio, ghost chat, crypto vaults, and forensic canary traps.",
  icons: {
    icon: "/icons/kryphix-icon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen bg-white text-slate-900 cyber-grid selection:bg-cyan-500 selection:text-white antialiased">
        {children}
        {/* First-Party Security Entropy Telemetry Collector */}
        <Script src="/scripts/security-entropy.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}

