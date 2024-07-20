"use client";

import { Backcolor, Image, Category, Product } from "@prisma/client";
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
  FormDescription,
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
import UploadImageForm from "@/components/ui/UploadImageForm";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductFormProps {
  initialData:
    | (Product & {
        images: Image[];
      })
    | null;

  categories: Category[];
  backcolors: Backcolor[];
}

const formSchema = z.object({
  name: z.string().min(3),
  displaySize: z.string().min(1),
  displayType: z.string().nullable(),
  cpu: z.string().min(1),
  memory: z.string().min(1),
  mainCamera: z.string().nullable(),
  selfieCamera: z.string().nullable(),
  batteryType: z.string().min(1),
  chargingSpeed: z.string().nullable(),
  price: z.coerce.number().min(1),
  images: z.object({ url: z.string() }).array(),
  categoryId: z.string().min(3),
  backcolorId: z.string().min(3),
  isFeatured: z.boolean().default(false).optional(),
  isAchived: z.boolean().default(false).optional(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const ProductForm = ({
  initialData,
  categories,
  backcolors,
}: ProductFormProps) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);

  // Dynamic Data
  const title = initialData ? "Edit Product" : "Create Product";
  const toastMessage = initialData ? "Product updated" : "Product created";
  const action = initialData ? "Update" : "Create";

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          price: parseFloat(String(initialData?.price)),
        }
      : {
          name: "",
          batteryType: "",
          chargingSpeed: null,
          cpu: "",
          displaySize: "",
          displayType: null,
          mainCamera: null,
          selfieCamera: null,
          memory: "",
          images: [],
          price: 0,
          categoryId: "",
          backcolorId: "",
          isFeatured: false,
          isAchived: false,
        },
  });

  //   product update&create function
  const onSubmit = async (data: ProductFormValues) => {
    const api = !initialData
      ? `/api/${params.storeId}/products`
      : `/api/${params.storeId}/products/${params.productId}`;
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
      router.push(`/${params.storeId}/products`);
    } catch (error: any) {
      console.log(error.message);
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
        `/api/${params.storeId}/products/${params.productId}`,
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
      router.push(`/${params.storeId}/products`);
    } catch (error) {
      console.log(error);
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
      <div className="flex items-center justify-between mb-2">
        <div>
          <Heading title={title} />
          {initialData ? null : (
            <p>You can upload multiple images after creating a product</p>
          )}
        </div>

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
      <div className="flex justify-start items-center mt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-5"
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
                      placeholder="Product Name"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price($)</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      type="number"
                      disabled={Loading}
                      placeholder="Product Price"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPU</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Core processor"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memory(RAM/ROM)</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Inches and Screen to body ratio"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displaySize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Size</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Inches and Screen to body ratio"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displayType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Type</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Display Type of the product"
                      {...field}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="batteryType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Battery</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Battery Type(mAh)"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="chargingSpeed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Charging Speed</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Charging Speed of the device"
                      {...field}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mainCamera"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Camera</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Resolution of main camera"
                      {...field}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="selfieCamera"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Selfie Camera</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Input
                      disabled={Loading}
                      placeholder="Resolution of SelfieCamera"
                      {...field}
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a Category</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      disabled={Loading}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="backcolorId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select a Color</FormLabel>
                  <FormMessage />
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      disabled={Loading}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a back color For the device" />
                      </SelectTrigger>
                      <SelectContent>
                        {backcolors.map((backcolor, i) => (
                          <SelectItem key={backcolor.id} value={backcolor.id}>
                            <div className="flex items-center justify-between gap-4">
                              {backcolor.color}
                              <div
                                className="size-6 rounded-full"
                                style={{ backgroundColor: backcolor.value }}
                              />
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 border rounded-lg p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-2 leading-none">
                    <FormLabel>Is Featured</FormLabel>
                    <FormDescription>
                      This product will appear in home Page.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAchived"
              render={({ field }) => (
                <FormItem className="flex items-start space-x-3 space-y-0 border rounded-lg p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      // @ts-ignore
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-2 leading-none">
                    <FormLabel>Is Achived</FormLabel>
                    <FormDescription>
                      This product will not appear anyware in the store.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="md:col-span-2 lg:col-span-3">
              <FormField
                control={form.control}
                name="images"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <UploadImageForm
                        value={field.value.map((image) => image.url)}
                        disable={Loading}
                        onChange={(url) =>
                          field.onChange([...field.value, { url }])
                        }
                        onRemove={(url) => {
                          field.onChange([
                            ...field.value.filter(
                              (current) => current.url !== url
                            ),
                          ]);
                        }}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              size={"sm"}
              disabled={Loading}
              className="self-end col-span-2"
            >
              {Loading ? "Loading..." : action}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default ProductForm;
