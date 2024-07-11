import { UserButton } from "@clerk/nextjs";
import React from "react";

import MainNav from "./MainNav";
import { StoreSwitcher } from "./StoreSwitcher";
import { auth } from "@clerk/nextjs/server";
import prismadb from "@/lib/PrismaDB";
import { redirect } from "next/navigation";

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
      <div className="border-b">
        <div className="flex h-14 w-full items-center justify-between px-5">
          <StoreSwitcher items={stores} />
          <MainNav />
          <div className="flex items-center space-x-4">
            <UserButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
