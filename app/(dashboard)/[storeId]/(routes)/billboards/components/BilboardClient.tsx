"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { FaPlus } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import BilboardCard from "./BilboardCard";
import { Billboard } from "@prisma/client";
import { Input } from "@/components/ui/input";
import BillboardApi from "./BillboardApi";

interface BillboardClientProps {
  billboards: Billboard[];
}

const BilboardClient = ({ billboards }: BillboardClientProps) => {
  const router = useRouter();
  const { storeId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const title =
    billboards.length > 0
      ? `Billboards(${billboards.length})`
      : "Billboards(...)";

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredBillboards = billboards.filter((billboard) =>
    billboard.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} desc="This is Billboard" />
        <Button
          onClick={() => router.push(`/${storeId}/billboards/new`)}
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
        {filteredBillboards?.map((billboard) => (
          <BilboardCard key={billboard.id} billboard={billboard} />
        ))}
      </div>
      <Separator />

      {/* Api Show Case */}
      <BillboardApi />
    </>
  );
};

export default BilboardClient;
