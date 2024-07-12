"use client";

import { Billboard } from "@prisma/client";
import { FaTrash } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import AlertModal from "@/components/modals/alert-modal";
import UploadImageForm from "@/components/ui/UploadImageForm";

interface BillboardFormProps {
  initialData: Billboard | null;
}

const formSchema = z.object({
  label: z.string().min(3),
  imgUrl: z.string().min(5),
});

type BillboardFormValues = z.infer<typeof formSchema>;

const BillboardForm = ({ initialData }: BillboardFormProps) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  // Dynamic Data
  const title = initialData ? "Edit Billboard" : "Create Billboard";
  const toastMessage = initialData ? "Billboard updated" : "Billboard created";
  const action = initialData ? "Update" : "Create";

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      label: "",
      imgUrl: "",
    },
  });

  //   billboard update&create function
  const onSubmit = async (data: BillboardFormValues) => {
    const api = !initialData
      ? `/api/${params.storeId}/billboards`
      : `/api/${params.storeId}/billboards/${params.billboardId}`;
    const method = initialData ? "PATCH" : "POST";

    setLoading(true);
    try {
      const res = await fetch(api, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      router.refresh();
      toast({
        title: toastMessage,
      });
      router.push(`/api/${params.storeId}/billboards`);
    } catch (error: any) {
      toast({
        title: `Failed : ${error.message}`,
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // delete billboard
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/${params.storeId}/billboards/${params.billboardId}`,
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

      setOpen(false);
      toast({
        title: "Successfully Deleted",
      });

      router.refresh();
      router.push("/");
    } catch (error) {
      setOpen(false);
      toast({
        title: "Delete Failed",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onComfirm={handleDelete}
        loading={Loading}
      />
      {/* Heading */}
      <div className="flex items-center justify-between">
        <Heading title={title} />

        {initialData && (
          <Button
            size={"sm"}
            variant={"destructive"}
            disabled={Loading}
            onClick={() => setOpen(true)}
          >
            <FaTrash />
          </Button>
        )}
      </div>
      <Separator />
      {/* Update Form */}
      <div className="flex justify-start items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-start justify-start gap-4"
          >
            <FormField
              control={form.control}
              name="imgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <UploadImageForm
                      value={field.value ? [field.value] : []}
                      disable={Loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={(url) => field.onChange("")}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Billboard label"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size={"sm"}
              disabled={Loading}
              className="self-end"
            >
              {Loading ? "Loading..." : action}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default BillboardForm;
