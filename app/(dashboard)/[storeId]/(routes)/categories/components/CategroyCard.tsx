"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Category, Billboard } from "@prisma/client";

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

const CategroyCard = ({ category }: { category: Category }) => {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [billboard, setBillboard] = useState<Billboard | null>(null);

  const billboards = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/${params.storeId}/billboards/${category.billboardId}`
      );

      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const data: Billboard = await res.json();
      setBillboard(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    billboards();
  }, [category.billboardId]);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/${params.storeId}/categories/${category.id}`,
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
              <CardTitle>{category.name}</CardTitle>
              <CardDescription>
                Billboard: {billboard !== null ? billboard.label : "Loading..."}
              </CardDescription>
              <CardDescription>
                Created At:{" "}
                {new Date(category.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
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
                          `/${params.storeId}/categories/${category.id}`
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
                        navigator.clipboard.writeText(category.id);
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

export default CategroyCard;
