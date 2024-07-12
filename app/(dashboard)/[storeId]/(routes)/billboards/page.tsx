import React from "react";
import BilboardClient from "./components/BilboardClient";
import prismadb from "@/lib/PrismaDB";

const Billboard = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId.toString(),
    },
  });

  return (
    <section className="container pt-2 flex flex-col">
      <BilboardClient billboards={billboards} />
    </section>
  );
};

export default Billboard;
