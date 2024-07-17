"use client";
import React, { useState } from "react";

import { useParams, useRouter } from "next/navigation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import AlertModal from "@/components/modals/alert-modal";

const CellAction = ({ id }: { id: string }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/${params.storeId}/products/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete");
      }

      setIsOpen(false);
      toast({
        title: "Successfully Deleted",
      });

      router.refresh();
    } catch (error) {
      setIsOpen(false);
      toast({
        title: "Delete Failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();
  const params = useParams();
  return (
    <div>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onComfirm={handleDelete}
        loading={isLoading}
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button variant={"outline"} className="w-full" disabled={isLoading}>
            Action
          </Button>
        </PopoverTrigger>
        <PopoverContent asChild className="w-[150px]">
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => {
                router.push(`/${params.storeId}/products/${id}`);
              }}
              variant="default"
              type="button"
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              type="button"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              Delete
            </Button>
            <Button
              onClick={() => {
                navigator.clipboard.writeText(id);
                toast({
                  title: "product ID copied to clipboard",
                });
              }}
              variant="outline"
              type="button"
              size={"lg"}
            >
              Copy ID
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CellAction;
