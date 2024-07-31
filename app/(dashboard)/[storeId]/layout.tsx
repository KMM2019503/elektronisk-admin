import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Loading from "./(routes)/loading";
import Sidebar from "@/components/Sidebar";

const DashboardLayoutComponent = async function DashboardLayoutComponent({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
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
    <>
      <Navbar />
      <div className="flex size-full">
        <Sidebar />
        <section id="main" className="w-full h-full">
          {children}
        </section>
      </div>
    </>
  );
};

DashboardLayoutComponent.displayName = "DashboardLayoutComponent";

export default DashboardLayoutComponent;
