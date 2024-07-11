import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import SettingForm from "./components/SettingForm";

interface SettingProps {
  params: {
    storeId: string;
  };
}

const SettingPage = async ({ params }: SettingProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      userId,
    },
  });

  if (!store) {
    redirect("/");
  }
  return (
    <section className="container pt-2 flex flex-col">
      <div className="flex-1 space-y-2">
        <SettingForm initialData={store} />
      </div>
    </section>
  );
};

export default SettingPage;
