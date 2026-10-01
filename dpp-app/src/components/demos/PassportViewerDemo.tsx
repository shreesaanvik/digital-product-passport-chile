"use client";

type Props = {
  onOpenPassport: () => void;
};

export function PassportViewerDemo({ onOpenPassport }: Props) {
  return (
    <div className="space-y-4">
      <p className="text-fm-ink">
        Open the passport screen to see the page a buyer or customs officer gets
        from the label QR code.
      </p>
      <button
        type="button"
        onClick={onOpenPassport}
        className="btn-primary min-h-[52px] w-full text-lg font-semibold"
      >
        Open passport
      </button>
    </div>
  );
}
