"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Backcolor } from "@prisma/client";

import { toast } from "@/components/ui/use-toast";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/alert-modal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const BackcolorCard = ({ backcolor }: { backcolor: Backcolor }) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/${params.storeId}/backcolors/${backcolor.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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

  return (
    <div>
      <AlertModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onComfirm={handleDelete}
        loading={isLoading}
      />
      <Card className="max-w-[350px]">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center justify-around gap-3 md:gap-0">
            <div className="flex flex-col gap-2">
              <CardTitle>{backcolor.color}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 font-bold">
                  Color: {backcolor.value}
                  <div
                    className="size-6 rounded-full shadow-2xl"
                    style={{ backgroundColor: backcolor.value }}
                  ></div>
                </div>
              </CardDescription>
              <CardDescription>
                <div className="flex items-center gap-2">
                  Created At:{" "}
                  {new Date(backcolor.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </CardDescription>
            </div>
            <div className="flex w-full md:w-auto justify-end items-end">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className="w-full"
                    disabled={isLoading}
                  >
                    Action
                  </Button>
                </PopoverTrigger>
                <PopoverContent asChild className="w-[150px]">
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => {
                        router.push(
                          `/${params.storeId}/backcolors/${backcolor.id}`
                        );
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
                        navigator.clipboard.writeText(backcolor.id);
                        toast({
                          title: "Category ID copied to clipboard",
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
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default BackcolorCard;
