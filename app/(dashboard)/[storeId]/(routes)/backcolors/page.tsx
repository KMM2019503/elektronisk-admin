import React from "react";

import prismadb from "@/lib/PrismaDB";
import BackcolorClient from "./components/BackcolorClient";

const Category = async ({ params }: { params: { storeId: string } }) => {
  const backcolors = await prismadb.backcolor.findMany({
    where: {
      storeId: params.storeId.toString(),
    },
  });

  return (
    <section className="container pt-2 flex flex-col">
      <BackcolorClient backcolors={backcolors} />
    </section>
  );
};

export default Category;
