"use client";

import React, { useState } from "react";
import {
  OrderItem as OrderItemType,
  Order as OrderType,
  Product,
} from "@prisma/client";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import OrderCard from "./OrderCard";

interface OrderItem extends OrderItemType {
  product: Product;
}

interface Order extends OrderType {
  orderItem: OrderItem[];
}

const OrderClient = ({ orders }: { orders: Order[] }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const title = orders.length > 0 ? `Orders(${orders.length})` : "Orders";

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredCategories = orders.filter((order) =>
    order.orderItem.some((item) =>
      item.product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} desc="You can manage your orders" />
      </div>
      <Separator />
      {orders.length > 0 && (
        <div className="flex mt-5">
          <Input
            placeholder="Search billboard..."
            className="lg:w-[50%]"
            onChange={handleSearchInputChange}
            value={searchQuery}
          />
        </div>
      )}
      {orders.length > 0 ? (
        <div className="grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-3 gap-5 md:max-h-[280px] md:overflow-y-auto">
          {filteredCategories?.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="w-full text-center mt-6">
          <p>There is no orders</p>
        </div>
      )}
    </>
  );
};

export default OrderClient;
