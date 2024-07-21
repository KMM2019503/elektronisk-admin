import prismadb from "@/lib/PrismaDB";

export const GetInStockProducts = async (storeId: string) => {
  const inStockProducts = await prismadb.product.findMany({
    where: {
      storeId: storeId,
      isAchived: false,
    },
  });

  return inStockProducts;
};
