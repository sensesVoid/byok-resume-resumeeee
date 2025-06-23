import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Zm56-88a56 56 0 0 1-112 0a55.29 55.29 0 0 1 1.32-12h29.43a28.2 28.2 0 0 0-1.75 12a28 28 0 0 0 56 0a28.2 28.2 0 0 0-1.75-12h29.43A55.29 55.29 0 0 1 184 128Z"
      />
    </svg>
  );
}
