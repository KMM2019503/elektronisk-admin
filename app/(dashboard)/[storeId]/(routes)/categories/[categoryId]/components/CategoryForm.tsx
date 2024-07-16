"use client";

import { Billboard, Category } from "@prisma/client";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFormProps {
  initialData: Category | null;
  billboards: Billboard[];
}

const formSchema = z.object({
  name: z.string().min(3),
  billboardId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;

const CategoryForm = ({ initialData, billboards }: CategoryFormProps) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  // Dynamic Data
  const title = initialData ? "Edit Category" : "Create Category";
  const toastMessage = initialData ? "Category updated" : "Category created";
  const action = initialData ? "Update" : "Create";

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      billboardId: "",
    },
  });

  //   category update&create function
  const onSubmit = async (data: CategoryFormValues) => {
    const api = !initialData
      ? `/api/${params.storeId}/categories`
      : `/api/${params.storeId}/categories/${params.categoryId}`;
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
      router.push(`/${params.storeId}/categories`);
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

  // delete category
  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/${params.storeId}/categories/${params.categoryId}`,
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
      router.push(`/${params.storeId}/categories`);
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Category Name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billboardId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a Bailboard</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      disabled={Loading}
                      value={initialData?.billboardId}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Billboard" />
                      </SelectTrigger>
                      <SelectContent>
                        {billboards.map((billboard, i) => (
                          <SelectItem key={billboard.id} value={billboard.id}>
                            {billboard.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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

export default CategoryForm;
