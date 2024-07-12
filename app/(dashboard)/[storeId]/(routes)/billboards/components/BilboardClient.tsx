"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { FaPlus } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";

const BilboardClient = () => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Billboard(0)" desc="This is Billboard" />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
          size={"sm"}
          className="bg-green-500 hover:bg-green-600"
        >
          <FaPlus />
        </Button>
      </div>

      <Separator />
    </>
  );
};

export default BilboardClient;
