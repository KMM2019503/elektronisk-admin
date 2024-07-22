import prismadb from "@/lib/PrismaDB";

interface ChartData {
  name: string;
  total: number;
}

export const GetChartRevenue = async (storeId: string) => {
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

  const monthlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrder) {
    const month = order.createdAt.getMonth();
    let revenueForOrderByMonth = 0;

    for (const item of order.orderItem) {
      revenueForOrderByMonth += item.product.price.toNumber();
    }

    monthlyRevenue[month] =
      (monthlyRevenue[month] || 0) + revenueForOrderByMonth;
  }

  const chartData: ChartData[] = [
    { name: "JAN", total: 0 },
    { name: "FEB", total: 0 },
    { name: "MAR", total: 0 },
    { name: "APR", total: 0 },
    { name: "MAY", total: 0 },
    { name: "JUN", total: 0 },
    { name: "JUL", total: 0 },
    { name: "AUG", total: 0 },
    { name: "SEP", total: 0 },
    { name: "OCT", total: 0 },
    { name: "NOV", total: 0 },
    { name: "DEC", total: 0 },
  ];

  for (const month in chartData) {
    chartData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return chartData;
};
