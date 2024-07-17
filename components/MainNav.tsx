"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const MainNav = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) => {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Home",
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
      label: "Back Colors",
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
    <nav className={cn("flex space-x-2 lg:space-x-4", className)}>
      {routes.map((route, index) => (
        <Link
          href={route.href}
          key={index}
          className={cn(
            "text-center text-sm lg:text-base font-medium transition-all hover:text-primary",
            route.isActive
              ? "text-orange-500 dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
