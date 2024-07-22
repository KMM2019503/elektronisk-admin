import React from "react";

import prismadb from "@/lib/PrismaDB";

import OrderClient from "./components/OrderClient";
import { Order } from "@prisma/client";
import { OrderColumn } from "./components/columns";

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
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    isPaid: order.isPaid,
    phone: order.phone,
    address: order.address,
    totalPrice: order.orderItem.reduce((sum, item) => {
      return sum + item.product.price.toNumber();
    }, 0),
    products: order.orderItem.map((item) => item.product.name).join(", "),
    createdAt: new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }));

  return (
    <section className="container pt-2 flex flex-col">
      <OrderClient orders={formattedOrders} />
    </section>
  );
};

export default Category;
