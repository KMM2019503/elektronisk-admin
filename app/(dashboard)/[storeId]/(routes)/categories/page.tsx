import React from "react";
import prismadb from "@/lib/PrismaDB";
import CategoryClient from "./components/CategroyClient";

const Category = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId.toString(),
    },
    include: {
      billboard: true,
    },
  });

  return (
    <section className="container pt-2 flex flex-col">
      <CategoryClient categories={categories} />
    </section>
  );
};

export default Category;
