import prismadb from "@/lib/PrismaDB";

interface ChartData {
  name: string;
  total: number;
}

export const GetChartSaleCount = async (
  storeId: string
): Promise<ChartData[]> => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId: storeId,
      isPaid: true,
    },
    include: {
      orderItem: {
        include: {
          product: true,
        },
      },
    },
  });

  const productCountMap: { [key: string]: number } = {};

  // Iterate over the orders to count the products
  paidOrders.forEach((order) => {
    order.orderItem.forEach((item) => {
      const productName = item.product.name;
      if (productCountMap[productName]) {
        productCountMap[productName] += 1;
      } else {
        productCountMap[productName] = 1;
      }
    });
  });

  // Transform the map into the desired array format
  const productSaleCount: ChartData[] = Object.keys(productCountMap).map(
    (key) => ({
      name: key,
      total: productCountMap[key],
    })
  );

  return productSaleCount;
};
