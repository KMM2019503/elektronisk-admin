"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { FaPlus } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import BilboardCard from "./BilboardCard";
import { Billboard } from "@prisma/client";

interface BillboardClientProps {
  billboards: Billboard[];
}

const BilboardClient = ({ billboards }: BillboardClientProps) => {
  const router = useRouter();
  const { storeId } = useParams();
  // const [billboards, setBillboards] = useState<Billboard[]>([]);
  // const [loading, setLoading] = useState(true);

  // const fetchBillboards = async () => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`/api/${storeId}/billboards`);
  //     if (res.ok) {
  //       const data = await res.json();
  //       setBillboards(data);
  //     } else {
  //       throw new Error("Failed to fetch billboards");
  //     }
  //   } catch (error) {
  //     console.log("🚀 ~ fetchBillboards ~ error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchBillboards();
  // }, [storeId]);

  const title =
    billboards.length > 0
      ? `Billboards(${billboards.length})`
      : "Billboards(...)";

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} desc="This is Billboard" />
        <Button
          onClick={() => router.push(`/${storeId}/billboards/new`)}
          size={"sm"}
          className="bg-green-500 hover:bg-green-600"
        >
          <FaPlus />
        </Button>
      </div>
      <Separator />

      <div className="grid justify-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3 gap-5">
        {billboards?.map((billboard) => (
          <BilboardCard key={billboard.id} billboard={billboard} />
        ))}
      </div>
    </>
  );
};

export default BilboardClient;
