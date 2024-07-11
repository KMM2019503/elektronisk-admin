"use client";

import * as z from "zod";
import { useState } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";
import Modal from "@/components/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

const formSchema = z.object({
  name: z.string().min(3, {
    message: "Store Name must be at least 3 characters.",
  }),
});

const StoreModal = () => {
  const [Loading, setLoading] = useState(false);
  const storeModal = useStoreModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // create a new store
    setLoading(true);
    try {
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      window.location.assign(`${data.id}`);
    } catch (error) {
      toast({
        title: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Create New Store"
      description="Add new store to manage products and categories"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-2 py-2 pb-5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-3">
                    <FormLabel>Name</FormLabel>
                    <FormMessage />
                    <FormControl>
                      <Input
                        disabled={Loading}
                        placeholder="Mi Mobile Phone Store"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                {Loading ? "Loading..." : "Create New Store"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default StoreModal;
