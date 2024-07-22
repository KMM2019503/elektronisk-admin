import prismadb from "@/lib/PrismaDB";

export const GetTopSaleProduct = async (storeId: string) => {
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

  const productSales: Record<string, { product: any; quantity: number }> = {};

  paidOrders.forEach((order) => {
    order.orderItem.forEach((item) => {
      const productId = item.productId;
      if (!productSales[productId]) {
        productSales[productId] = { product: item.product, quantity: 0 };
      }
      productSales[productId].quantity += 1;
    });
  });

  let topSaleProduct = null;
  let maxQuantity = 0;
  for (const productId in productSales) {
    if (productSales[productId].quantity > maxQuantity) {
      topSaleProduct = productSales[productId].product;
      maxQuantity = productSales[productId].quantity;
    }
  }

  return topSaleProduct;
};
