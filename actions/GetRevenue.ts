import prismadb from "@/lib/PrismaDB";

export const GetRevenue = async (storeId: string) => {
  const paidOrder = await prismadb.order.findMany({
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

  const totalPrice = paidOrder.reduce((total, order) => {
    const orderTotal = order.orderItem.reduce((OrderSum, item) => {
      return OrderSum + item.product.price.toNumber();
    }, 0);

    return total + orderTotal;
  }, 0);

  return totalPrice.toFixed(2);
};
