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
import Image from "next/image";

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
          <div className="w-full flex items-center justify-around gap-5">
            <div className="relative overflow-hidden rounded-sm w-[250px] h-[250px] md:w-[100px] md:h-[100px] mx-auto lg:mx-0">
              {/* <CldImage
              width={300}
              height={300}
              crop={"fill"}
              src={billboard.imgUrl}
              sizes="300px"
              alt="Description of my image"
              className="w-[300px] h-[300px] lg:w[100px] lg:w[100px]"
            /> */}
              <Image
                src={billboard.imgUrl}
                fill
                alt={billboard.label}
                className="object-fill"
              />
            </div>

            <div className="md:flex flex-col gap-2 hidden">
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    router.push(
                      `/${params.storeId}/billboards/${billboard.id}`
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
                  Detele
                </Button>
              </div>

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
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-3 flex justify-end items-center md:hidden">
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
