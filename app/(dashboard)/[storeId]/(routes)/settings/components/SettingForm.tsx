"use client";

import { Store } from "@prisma/client";
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

interface SettingFormProps {
  initialData: Store;
}

const formSchema = z.object({
  name: z.string().min(3),
});

type SettingFormValues = z.infer<typeof formSchema>;

const SettingForm = ({ initialData }: SettingFormProps) => {
  const router = useRouter();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [Loading, setLoading] = useState(false);
  const form = useForm<SettingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  //   store update function
  const onSubmit = async (data: SettingFormValues) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stores/${initialData.id}`, {
        method: "PATCH",
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
        title: "Successfully Updated",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/stores/${params.storeId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
      <div className="flex items-center justify-between">
        {/* Heading */}
        <Heading title="Settings" desc={`Customize ${initialData.name}`} />

        <Button
          size={"sm"}
          variant={"destructive"}
          disabled={Loading}
          onClick={() => setOpen(true)}
        >
          <FaTrash />
        </Button>
      </div>
      <Separator />
      <div className="flex justify-center items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center justify-between"
          >
            <div className="grid grid-cols-3 gap-8">
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
                        placeholder="Store Name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" size={"lg"} disabled={Loading}>
              {Loading ? "Loading..." : "Update Store"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
};

export default SettingForm;
