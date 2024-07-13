"use client";
import { useState } from "react";
import { CldImage } from "next-cloudinary";
import { Billboard } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import AlertModal from "@/components/modals/alert-modal";

const BilboardCard = ({ billboard }: { billboard: Billboard }) => {
  const router = useRouter();
  const params = useParams();

  // custom hook

  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // handle Delete
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/${params.storeId}/billboards/${billboard.id}`,
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
      // router.push(`/${params.storeId}/billboards`);
      toast({
        title: "Successfully Deleted",
      });
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
          <CardTitle>{billboard.label}</CardTitle>
          <CardDescription>
            Created At :{" "}
            {billboard.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="w-full aspect-w-16 aspect-h-9 relative overflow-hidden rounded-lg">
            <CldImage
              width={300}
              height={300}
              crop={"fill"}
              src={billboard.imgUrl}
              sizes="300px"
              alt="Description of my image"
            />
          </div>
        </CardContent>
        <CardFooter className="gap-3 flex justify-end items-center">
          <Button
            onClick={() => {
              navigator.clipboard.writeText(billboard.id);
              toast({
                title: "Billboard id copied from clipboard",
              });
            }}
            variant="outline"
            type="button"
            size={"lg"}
          >
            Copy ID
          </Button>
          <Button
            onClick={() => {
              router.push(`/${params.storeId}/billboards/${billboard.id}`);
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
            Detele
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BilboardCard;
