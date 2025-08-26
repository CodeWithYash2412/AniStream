import type { SVGProps } from "react";

export const Katana = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2 2l12 12" />
    <path d="M9 10.5 2.5 17" />
    <path d="M14 4.5 21.5 12" />
    <path d="m3 21 6-6" />
    <path d="m15 9 6-6" />
    <path d="M10.5 13.5 8 16" />
    <path d="M18 10c-2-2-4-2-6 0" />
    <path d="M14 14c-2-2-4-2-6 0" />
  </svg>
);
