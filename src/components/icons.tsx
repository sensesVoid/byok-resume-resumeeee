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
        d="M208,88H152a8,8,0,0,1-8-8V24a8,8,0,0,0-8-8H72A16,16,0,0,0,56,32V224a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V96A8,8,0,0,0,208,88ZM160,51.31L180.69,72H160Z"
      />
    </svg>
  );
}
