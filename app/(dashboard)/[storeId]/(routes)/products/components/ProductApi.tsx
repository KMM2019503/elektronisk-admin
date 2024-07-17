"use client";

import ApiAlert from "@/components/ui/api-alert";
import Heading from "@/components/ui/heading";
import useOrigin from "@/hooks/useOrigin";
import { useParams } from "next/navigation";

const ProductApi = () => {
  const params = useParams();
  const origin = useOrigin();

  return (
    <div className="mt-3">
      <Heading title="API For Product" />
      <div className="flex flex-col gap-2">
        <ApiAlert
          title="GET"
          desc={`${origin}/api/${params.storeId}/products`}
          varient="public"
        />
        <ApiAlert
          title="GET"
          desc={`${origin}/api/${params.storeId}/products/{Product ID}`}
          varient="public"
        />
      </div>
    </div>
  );
};

export default ProductApi;
