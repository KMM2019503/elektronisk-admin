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

const DashboardHome = async ({ params }: { params: { storeId: string } }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

  const revenue = await GetRevenue(params.storeId);
  const saleCount = await GetSale(params.storeId);
  const inStockProduct = await GetInStockProducts(params.storeId);

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <TbDeviceImacDollar className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${revenue}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <FcSalesPerformance className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">+{saleCount.length}</div>
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
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default DashboardHome;
