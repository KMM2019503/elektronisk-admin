import prismadb from "@/lib/PrismaDB";
import React from "react";

const DashboardHome = async ({ params }: { params: { storeId: string } }) => {
  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
    },
  });

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
        <p>Welcome Form Dashboard</p>
      </section>
    </>
  );
};

export default DashboardHome;
