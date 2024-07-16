"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { FaPlus } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import BackcolorCard from "./BackcolorCard";
import { Backcolor } from "@prisma/client";
import { Input } from "@/components/ui/input";
import BackcolorAPi from "./BackcolorApi";

interface BackcolorClientProps {
  backcolors: Backcolor[];
}

const BackcolorClient = ({ backcolors }: BackcolorClientProps) => {
  const router = useRouter();
  const { storeId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const title =
    backcolors.length > 0 ? `Back Colors(${backcolors.length})` : "Back Colors";

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredCategories = backcolors.filter((backcolor) =>
    backcolor.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={title}
          desc="You can manage your products back colors"
        />
        <Button
          onClick={() => router.push(`/${storeId}/backcolors/new`)}
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
        {filteredCategories?.map((Backcolor) => (
          <BackcolorCard key={Backcolor.id} backcolor={Backcolor} />
        ))}
      </div>
      <Separator />

      {/* Api Show Case */}
      <BackcolorAPi />
    </>
  );
};

export default BackcolorClient;
