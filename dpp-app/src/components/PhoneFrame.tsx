"use client";

import Image from "next/image";
import { Suspense, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { PHONE_SCREEN_ID } from "@/lib/scrollLock";

const COPY = {
  es: {
    title: "Pasaporte Digital de Producto · Chile",
    demo: "Demo con datos de ejemplo",
    hint: "Use el teléfono para explorar la aplicación",
  },
  en: {
    title: "Digital Product Passport · Chile",
    demo: "Demo with sample data",
    hint: "Use the phone to explore the app",
  },
} as const;

type FrameLang = keyof typeof COPY;

function SidePanelCopy({ lang }: { lang: FrameLang }) {
  const copy = COPY[lang];

  return (
    <aside className="phone-frame-panel">
      <Image
        src="/logo.png"
        alt="Fashion Mingle"
        width={280}
        height={28}
        className="phone-frame-logo"
        style={{ width: "auto", height: "28px" }}
        priority
      />
      <p className="phone-frame-title">{copy.title}</p>
      <p className="phone-frame-demo">{copy.demo}</p>
      <p className="phone-frame-hint">{copy.hint}</p>
    </aside>
  );
}

function SidePanel() {
  const params = useSearchParams();
  const lang: FrameLang = params.get("lang") === "en" ? "en" : "es";
  return <SidePanelCopy lang={lang} />;
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone-frame-root">
      <Suspense fallback={<SidePanelCopy lang="es" />}>
        <SidePanel />
      </Suspense>
      <div className="phone-frame-sizer">
        <div className="phone-frame-device">
          <div className="phone-frame-screen">
            <div className="phone-frame-island" aria-hidden="true" />
            <div className="phone-frame-fixed">
              <div id={PHONE_SCREEN_ID} className="phone-frame-scroll">
                {children}
              </div>
            </div>
            <div className="phone-frame-home" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  );
}
