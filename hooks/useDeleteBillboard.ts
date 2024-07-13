// hooks/useDeleteBillboard.ts
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

interface useDeleteBillboardProps {
  storeId: string;
  billboardId: string;
}

const useDeleteBillboard = ({ ...props }: useDeleteBillboardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `/api/${props.storeId}/billboards/${props.billboardId}`,
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

      toast({
        title: "Successfully Deleted",
      });

      router.refresh();
      router.push(`/${props.storeId}/billboards`);
    } catch (error: any) {
      toast({
        title: "Delete Failed",
        description: error.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleDelete,
  };
};

export default useDeleteBillboard;
