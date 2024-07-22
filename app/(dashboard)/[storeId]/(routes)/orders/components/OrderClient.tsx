"use client";

import React, { useState } from "react";
import {
  OrderItem as OrderItemType,
  Order as OrderType,
  Product as ProductType,
} from "@prisma/client";

import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import { columns, OrderColumn } from "./columns";

interface OrderItem extends OrderItemType {
  product: ProductType;
}

interface Order extends OrderType {
  orderItem: OrderItem[];
}

const OrderClient = ({ orders }: { orders: OrderColumn[] }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const title = orders.length > 0 ? `Orders(${orders.length})` : "Orders";

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} desc="You can manage your orders" />
      </div>
      <Separator />

      <div className="container mx-auto py-5 overflow-y-auto">
        <DataTable
          searchKey="name"
          placeholder="search order...."
          columns={columns}
          data={orders}
        />
      </div>
    </>
  );
};

export default OrderClient;
