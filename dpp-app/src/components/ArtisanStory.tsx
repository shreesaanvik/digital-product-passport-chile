"use client";

import { ARTISAN } from "@/lib/data";
import { ArtisanHero, ArtisanMoneyPanel } from "./ArtisanHome";

type Props = {
  onOpenPassport: () => void;
};

export function ArtisanStory({ onOpenPassport }: Props) {
  const artisanFirst = ARTISAN.name.split(" ")[0];
  const stewardFirst = ARTISAN.steward.name.split(" ")[0];
  const place = ARTISAN.cluster.split(",")[0].trim();
  const subtitle = `${ARTISAN.generation}, ${place}`;
  const stage = ARTISAN.stages[ARTISAN.currentStage].toLowerCase();

  return (
    <article className="text-lg leading-relaxed text-fm-ink">
      <ArtisanHero title={ARTISAN.name} subtitle={subtitle} titleAs="h1" />

      <section className="mt-6">
        <h2 className="font-display text-2xl font-semibold leading-tight text-fm-ink">Her work</h2>
        <p className="mt-2">
          {ARTISAN.name} is a {ARTISAN.generation.toLowerCase()} in {ARTISAN.cluster}. Her craft
          is {ARTISAN.craft}. Her current order, {ARTISAN.order.code}, is {ARTISAN.order.product}{" "}
          for {ARTISAN.order.buyer}, and it is at {stage}.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-2xl font-semibold leading-tight text-fm-ink">
          How her work is recorded
        </h2>
        <p className="mt-2">
          Her steward is {ARTISAN.steward.name}, {ARTISAN.steward.role}. {stewardFirst} visits
          during production and records photo evidence with the date and location. {artisanFirst}{" "}
          gives consent by speaking with {stewardFirst} in her own language.
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-2xl font-semibold leading-tight text-fm-ink">
          What buyers see
        </h2>
        <p className="mt-2">
          The passport shows her name, craft, cluster and the production journey. Buyers who scan
          the label see those facts.
        </p>
        <button
          type="button"
          onClick={onOpenPassport}
          className="btn-primary mt-4 flex w-full min-h-[56px] items-center justify-center text-lg font-semibold"
        >
          Open the passport
        </button>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-2xl font-semibold leading-tight text-fm-ink">
          How she is paid
        </h2>
        <p className="mt-2">
          Payments are released at each stage of the order. Paid amounts have already been sent.
          Waiting amounts stay held until quality check is done, or until the order is shipped.
        </p>
        <div className="mt-4">
          <ArtisanMoneyPanel />
        </div>
      </section>
    </article>
  );
}
