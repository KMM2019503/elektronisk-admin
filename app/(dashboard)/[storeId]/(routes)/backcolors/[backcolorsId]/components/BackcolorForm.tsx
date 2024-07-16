"use client";

import { Backcolor } from "@prisma/client";
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

interface BackcolorFormProps {
  initialData: Backcolor | null;
}

const hexColorRegex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/;

const formSchema = z.object({
  color: z.string().min(3),
  value: z.string().regex(hexColorRegex, { message: "Invalid hex color code" }),
});

type BackcolorFormValues = z.infer<typeof formSchema>;

const BackcolorForm = ({ initialData }: BackcolorFormProps) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  // Dynamic Data
  const title = initialData ? "Edit Back Color" : "Create Back Color";
  const toastMessage = initialData
    ? "Back Color updated"
    : "Back Color created";
  const action = initialData ? "Update" : "Create";

  const form = useForm<BackcolorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      color: "",
      value: "",
    },
  });

  //   Backcolor update&create function
  const onSubmit = async (data: BackcolorFormValues) => {
    const api = !initialData
      ? `/api/${params.storeId}/backcolors`
      : `/api/${params.storeId}/backcolors/${params.backcolorsId}`;
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
      router.push(`/${params.storeId}/backcolors`);
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

  // delete Backcolor
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/${params.storeId}/backcolors/${params.backcolorsId}`,
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
      router.push(`/${params.storeId}/backcolors`);
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
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Name</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input disabled={Loading} placeholder="Red" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input
                        disabled={Loading}
                        placeholder="#FF0000"
                        {...field}
                      />
                      <div
                        className="h-5 w-6 rounded-[100%]"
                        style={{
                          backgroundColor: field.value
                            ? field.value
                            : "#FF0000",
                        }}
                      ></div>
                    </div>
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

export default BackcolorForm;
