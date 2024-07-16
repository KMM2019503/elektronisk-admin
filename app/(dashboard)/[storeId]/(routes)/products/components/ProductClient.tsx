"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Backcolor, Category, Product as ProductType } from "@prisma/client";

import { FaPlus } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

import ProductApi from "./ProductApi";
import ProductCard from "./ProductCard";

interface Product extends ProductType {
  category: Category;
  backcolor: Backcolor;
}

interface ProductClientProps {
  products: Product[];
}

const ProductClient = ({ products }: ProductClientProps) => {
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

  const filteredCategories = products.filter((products) =>
    products.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex mt-5">
        <Input
          placeholder="Search billboard..."
          className="lg:w-[50%]"
          onChange={handleSearchInputChange}
          value={searchQuery}
        />
      </div>
      <div className="grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 my-3 gap-5 md:max-h-[280px] md:overflow-y-auto">
        {filteredCategories?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Separator />

      {/* Api Show Case */}
      <ProductApi />
    </>
  );
};

export default ProductClient;
