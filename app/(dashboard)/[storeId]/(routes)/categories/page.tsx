import React from "react";
import BilboardClient from "./components/CategroyClient";
import prismadb from "@/lib/PrismaDB";

const Category = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId.toString(),
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId.toString(),
    },
  });

  return (
    <section className="container pt-2 flex flex-col">
      <BilboardClient categories={categories} />
    </section>
  );
};

export default Category;
