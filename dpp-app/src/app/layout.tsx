import type { Metadata, Viewport } from "next";
import { DM_Sans, Outfit } from "next/font/google";
import { PhoneFrame } from "@/components/PhoneFrame";
import { es } from "@/i18n/messages/es";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: es.meta.title,
  description: es.meta.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1799b5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-CL" className={`${dmSans.variable} ${outfit.variable}`}>
      <body className="font-sans min-h-dvh">
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var q=new URLSearchParams(location.search).get("lang");document.documentElement.lang=q==="en"?"en":"es-CL";}catch(e){}})();`,
          }}
        />
        <PhoneFrame>{children}</PhoneFrame>
      </body>
    </html>
  );
}
