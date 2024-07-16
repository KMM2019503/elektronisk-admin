"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { FaPlus } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import CategoryCard from "./CategroyCard";
import { Category } from "@prisma/client";
import { Input } from "@/components/ui/input";
import CategoryAPi from "./CategroyApi";

interface CategoryClientProps {
  categories: Category[];
}

const CategoryClient = ({ categories }: CategoryClientProps) => {
  const router = useRouter();
  const { storeId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const title =
    categories.length > 0 ? `Categories(${categories.length})` : "Categories";

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredCategories = categories.filter((categories) =>
    categories.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} desc="You can control your categories" />
        <Button
          onClick={() => router.push(`/${storeId}/categories/new`)}
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
        {filteredCategories?.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
      <Separator />

      {/* Api Show Case */}
      <CategoryAPi />
    </>
  );
};

export default CategoryClient;
