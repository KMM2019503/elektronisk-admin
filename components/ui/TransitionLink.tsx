"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface TransitionLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  href: string;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const TransitionLink = ({
  children,
  href,
  className,
  ...props
}: TransitionLinkProps) => {
  const router = useRouter();

  const handleClick = async (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.preventDefault();
    const main = document.getElementById("main");
    main?.classList.add("animate-transition");

    await sleep(500);
    router.push(href);
    await sleep(500);

    main?.classList.remove("animate-transition");
  };

  return (
    <Link href={href} {...props} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

export default TransitionLink;
