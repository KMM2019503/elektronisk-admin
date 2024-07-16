import React from "react";
import prismadb from "@/lib/PrismaDB";

import ProductClient from "./components/ProductClient";

const Category = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId.toString(),
    },
    include: {
      category: true,
      backcolor: true,
    },
  });

  return (
    <section className="container pt-2 flex flex-col">
      <ProductClient products={products} />
    </section>
  );
};

export default Category;
