/** Brand SVGs — Lucide no longer ships Instagram/YouTube/Facebook icons. */

export function InstagramIcon({ size = 18, strokeWidth = 1.6, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ size = 18, strokeWidth = 1.6, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M2.5 8.5a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4v7a4 4 0 0 1-4 4h-11a4 4 0 0 1-4-4v-7z" />
      <path d="M10 9.5v5l5-2.5-5-2.5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 18, strokeWidth = 1.6, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M14 8h2.5V5.5H14a3.5 3.5 0 0 0-3.5 3.5V12H8v3h2.5v6H14v-6h2.2l.8-3H14V9a1 1 0 0 1 1-1z" />
    </svg>
  );
}
