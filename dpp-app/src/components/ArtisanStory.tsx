"use client";

import { ARTISAN } from "@/lib/data";
import { useT } from "@/i18n/LanguageProvider";
import { phrase } from "@/i18n/labels";
import { ArtisanHero, ArtisanMoneyPanel } from "./ArtisanHome";

type Props = {
  onOpenPassport: () => void;
};

export function ArtisanStory({ onOpenPassport }: Props) {
  const t = useT();
  const artisanFirst = ARTISAN.name.split(" ")[0];
  const stewardFirst = ARTISAN.steward.name.split(" ")[0];
  const place = ARTISAN.cluster.split(",")[0].trim();
  const generation = phrase(ARTISAN.generation, t);
  const subtitle = `${generation}, ${place}`;
  const stage = phrase(ARTISAN.stages[ARTISAN.currentStage], t);

  return (
    <article className="text-lg leading-relaxed text-fm-ink">
      <ArtisanHero title={ARTISAN.name} subtitle={subtitle} titleAs="h1" />

      <section className="mt-6">
        <h2 className="font-display text-2xl font-semibold leading-tight text-fm-ink">
          {t.story.herWork}
        </h2>
        <p className="mt-2">
          {t.story.herWorkBody({
            name: ARTISAN.name,
            generation,
            cluster: ARTISAN.cluster,
            craft: phrase(ARTISAN.craft, t),
            code: ARTISAN.order.code,
            product: phrase(ARTISAN.order.product, t),
            buyer: phrase(ARTISAN.order.buyer, t),
            stage,
          })}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-2xl font-semibold leading-tight text-fm-ink">
          {t.story.howRecorded}
        </h2>
        <p className="mt-2">
          {t.story.howRecordedBody({
            stewardName: ARTISAN.steward.name,
            stewardRole: t.roles.stewardWithArea(ARTISAN.steward.area),
            stewardFirst,
            artisanFirst,
          })}
        </p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-2xl font-semibold leading-tight text-fm-ink">
          {t.story.whatBuyers}
        </h2>
        <p className="mt-2">{t.story.whatBuyersBody}</p>
        <button
          type="button"
          onClick={onOpenPassport}
          className="btn-primary mt-4 flex w-full min-h-[56px] items-center justify-center text-lg font-semibold"
        >
          {t.story.openPassport}
        </button>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-2xl font-semibold leading-tight text-fm-ink">
          {t.story.howPaid}
        </h2>
        <p className="mt-2">{t.story.howPaidBody}</p>
        <div className="mt-4">
          <ArtisanMoneyPanel />
        </div>
      </section>
    </article>
  );
}
