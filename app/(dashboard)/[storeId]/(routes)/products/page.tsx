import React from "react";
import prismadb from "@/lib/PrismaDB";

import ProductClient from "./components/ProductClient";
import { Product } from "./components/columns";

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

  const formattedProducts: Product[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price.toNumber(),
    isFeatured: product.isFeatured,
    isArchived: product.isAchived,
    category: product.category.name,
    backcolor: product.backcolor.value,
    createdAt: new Date(product.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }));

  return (
    <section className="container pt-2 flex flex-col">
      <ProductClient products={formattedProducts} />
    </section>
  );
};

export default Category;
