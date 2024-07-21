import prismadb from "@/lib/PrismaDB";

export const GetSale = async (storeId: string) => {
  const saleCount = await prismadb.order.findMany({
    where: {
      storeId: storeId,
      isPaid: true,
    },
  });

  return saleCount;
};
