import prismadb from "@/lib/PrismaDB";

import ProductForm from "./components/ProductForm";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const product = await prismadb.product.findFirst({
    where: {
      id: params.productId,
    },
    include: {
      images: true,
    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const backcolors = await prismadb.backcolor.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <>
      <div className="container pt-2 flex flex-col">
        <ProductForm
          initialData={product}
          categories={categories}
          backcolors={backcolors}
        />
      </div>
    </>
  );
};

export default ProductPage;
