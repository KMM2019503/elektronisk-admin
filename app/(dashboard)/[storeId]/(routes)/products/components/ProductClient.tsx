"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

import ProductApi from "./ProductApi";

import { columns, Product } from "./columns";
import { DataTable } from "../../../../../../components/ui/data-table";

const ProductClient = ({ products }: { products: Product[] }) => {
  const router = useRouter();
  const { storeId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const title =
    products.length > 0 ? `Products(${products.length})` : "Products";

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} desc="You can manage products" />
        <Button
          onClick={() => router.push(`/${storeId}/products/new`)}
          size={"sm"}
        >
          <FaPlus />
        </Button>
      </div>
      <Separator />
      <div className="container mx-auto py-10 lg:max-h-[400px] overflow-y-auto">
        <DataTable
          searchKey="name"
          placeholder="search product...."
          columns={columns}
          data={products}
        />
      </div>
      <Separator />

      {/* Api Show Case */}
      <ProductApi />
    </>
  );
};

export default ProductClient;
