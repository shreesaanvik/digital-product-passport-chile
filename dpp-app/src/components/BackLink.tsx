type Props = {
  onClick: () => void;
};

export function BackLink({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-[44px] text-base font-semibold text-fm-btn-text"
    >
      Back
    </button>
  );
}
