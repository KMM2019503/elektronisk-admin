import prismadb from "@/lib/PrismaDB";

import CategoryForm from "./components/CategoryForm";

const BillboardPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const category = await prismadb.category.findFirst({
    where: {
      id: params.categoryId,
    },
  });

  return (
    <>
      <div className="container pt-2 flex flex-col">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </>
  );
};

export default BillboardPage;
