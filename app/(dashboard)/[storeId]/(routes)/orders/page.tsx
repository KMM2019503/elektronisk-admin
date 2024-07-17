import React from "react";

import prismadb from "@/lib/PrismaDB";

import OrderClient from "./components/OrderClient";

const Category = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId.toString(),
    },
    include: {
      orderItem: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <section className="container pt-2 flex flex-col">
      <OrderClient orders={orders} />
    </section>
  );
};

export default Category;
