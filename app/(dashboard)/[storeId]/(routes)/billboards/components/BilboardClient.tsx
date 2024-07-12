"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { FaPlus } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Billboard } from "@prisma/client";

interface BilboardClientProps {
  billboards: Billboard[];
}

const BilboardClient = async ({ billboards }: BilboardClientProps) => {
  const router = useRouter();
  const globalParams = useParams();

  const title = billboards ? `Billboards(${billboards.length})` : "Billboards";

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} desc="This is Billboard" />
        <Button
          onClick={() => router.push(`/${globalParams.storeId}/billboards/new`)}
          size={"sm"}
          className="bg-green-500 hover:bg-green-600"
        >
          <FaPlus />
        </Button>
      </div>
      <Separator />
      {billboards?.map((billboard) => {
        return (
          <>
            <p>{billboard.id}</p>
            <p>{billboard.label}</p>
            <Image
              src={billboard.imgUrl}
              alt="ImageName"
              width={200}
              height={200}
            />
          </>
        );
      })}
    </>
  );
};

export default BilboardClient;
