type CreditsBadgeProps = {
  credits: number;
  small?: boolean;
};

export function CreditsBadge({ credits, small }: CreditsBadgeProps) {
  return (
    <span
      className={`rounded-full bg-yellow-400/10 ${
        small ? "px-3 py-1 text-xs" : "px-3 py-2 text-sm"
      } font-medium text-yellow-400 ring-1 ring-yellow-400/40 shadow-sm`}
    >
      {credits} {small ? "Left" : "Credits"}
    </span>
  );
}
