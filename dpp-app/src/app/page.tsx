import { Suspense } from "react";
import { HomeExperience } from "@/components/HomeExperience";

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-lg px-4 py-8 text-center text-fm-muted">
          Loading
        </main>
      }
    >
      <HomeExperience />
    </Suspense>
  );
}
