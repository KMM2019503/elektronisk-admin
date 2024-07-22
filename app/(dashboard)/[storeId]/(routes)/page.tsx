import React from "react";
import prismadb from "@/lib/PrismaDB";

import Heading from "@/components/ui/heading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TbDeviceImacDollar } from "react-icons/tb";
import { FcSalesPerformance } from "react-icons/fc";
import { LuPackagePlus } from "react-icons/lu";
import { GetRevenue } from "@/actions/GetRevenue";
import { GetSale } from "@/actions/GetSale";
import { GetInStockProducts } from "@/actions/GetStockProduct";
import { GetTopSaleProduct } from "@/actions/GetTopSaleProduct";
import { BsGraphUpArrow } from "react-icons/bs";
import Overview from "@/components/Overview";
import { GetChartRevenue } from "@/actions/GetChartRevenue";
import PieChartSlaeOrder from "@/components/PieChar";
import { FaChartBar } from "react-icons/fa";
import { TbChartPie4 } from "react-icons/tb";
import { GetChartSaleCount } from "@/actions/GetChartSaleCount";

const DashboardHome = async ({ params }: { params: { storeId: string } }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  const revenue = await GetRevenue(params.storeId);
  const saleCount = await GetSale(params.storeId);
  const inStockProduct = await GetInStockProducts(params.storeId);
  const topSaleProduct = await GetTopSaleProduct(params.storeId);
  const chartData = await GetChartRevenue(params.storeId);
  const saleCountPieChart = await GetChartSaleCount(params.storeId);

  // const fakeData = [
  //   { name: "SUN", total: 4500 },
  //   { name: "MON", total: 6030 },
  //   { name: "TUE", total: 2300 },
  //   { name: "WED", total: 1940 },
  //   { name: "THU", total: 3849 },
  //   { name: "FRI", total: 2450 },
  //   { name: "SAT", total: 2000 },
  // ];

  if (!store) {
    return (
      <>
        <p>wait a second..</p>
      </>
    );
  }
  return (
    <>
      <section className="container pt-2">
        <Heading title="Dashboard" desc="Overview of your store" />
        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <TbDeviceImacDollar className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenue}</div>
              {/* <div className="text-2xl font-bold">$45670.89</div> */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <FcSalesPerformance className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">+{saleCount.length}</div>
              {/* <div className="text-2xl font-bold">+231</div> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Product In Stock
              </CardTitle>
              <LuPackagePlus className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">+{inStockProduct.length}</div>
              {/* <div className="text-2xl font-bold">+98</div> */}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Top Sale Product
              </CardTitle>
              <BsGraphUpArrow className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{topSaleProduct.name}</div>
            </CardContent>
          </Card>
          <Card className="col-span-1 md:col-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Revenue Bar Graph
              </CardTitle>
              <FaChartBar className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <Overview data={chartData} />
              {/* <Overview data={fakeData} /> */}
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Sale Count Chart
              </CardTitle>
              <TbChartPie4 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <PieChartSlaeOrder data={saleCountPieChart} />
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default DashboardHome;
