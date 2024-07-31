import React from "react";

import MainNav from "./MainNav";
import { StoreSwitcher } from "./StoreSwitcher";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/PrismaDB";
import { redirect } from "next/navigation";
import MobileNavBar from "./MobileNavBar";
import { UserButton } from "@clerk/nextjs";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });

  return (
    <>
      <div className="hidden lg:flex flex-col h-full lg:max-w-[220px] items-center border-r pt-5 rounded-tr-2xl">
        <MainNav />
      </div>
    </>
  );
};

export default Navbar;
