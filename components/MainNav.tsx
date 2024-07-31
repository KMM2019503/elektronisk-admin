"use client";

import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import TransitionLink from "./ui/TransitionLink";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Dashboard",
      isActive: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Orders",
      isActive: pathname === `/${params.storeId}/orders`,
    },

    {
      href: `/${params.storeId}/billboards`,
      label: "Billboard",
      isActive: pathname === `/${params.storeId}/billboards`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Category",
      isActive: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/backcolors`,
      label: "Colors",
      isActive: pathname === `/${params.storeId}/backcolors`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Products",
      isActive: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/settings`,
      label: "Settings",
      isActive: pathname === `/${params.storeId}/settings`,
    },
  ];

  return (
    <nav className={cn("flex flex-col gap-y-6", className)}>
      {routes.map((route, index) => (
        <TransitionLink
          href={route.href}
          key={index}
          className={cn(
            "text-center text-sm lg:text-base font-medium transition-all hover:text-primary hover:bg-zinc-100 py-1 px-5 mx-[30px] rounded-md ",
            route.isActive
              ? "dark:text-white bg-zinc-100"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </TransitionLink>
      ))}
    </nav>
  );
};

export default MainNav;
