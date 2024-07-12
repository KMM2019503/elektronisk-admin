import prismadb from "@/lib/PrismaDB";
import BillboardForm from "./components/BillboardForm";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboard = await prismadb.billboard.findFirst({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <>
      <div className="container pt-2 flex flex-col">
        <BillboardForm initialData={billboard} />
      </div>
    </>
  );
};

export default BillboardPage;
