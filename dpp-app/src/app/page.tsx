import { Suspense } from "react";
import { HomeExperience } from "@/components/HomeExperience";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { es } from "@/i18n/messages/es";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-lg px-4 py-8 text-center text-fm-muted">
          {es.common.loading}
        </main>
      }
    >
      <LanguageProvider>
        <HomeExperience />
      </LanguageProvider>
    </Suspense>
  );
}
