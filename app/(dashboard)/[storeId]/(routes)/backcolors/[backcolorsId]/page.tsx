import prismadb from "@/lib/PrismaDB";
import BackcolorForm from "./components/BackcolorForm";

const BackcolorPage = async ({
  params,
}: {
  params: { backcolorsId: string; storeId: string };
}) => {
  const backcolors = await prismadb.backcolor.findFirst({
    where: {
      id: params.backcolorsId,
    },
  });

  return (
    <>
      <div className="container pt-2 flex flex-col">
        <BackcolorForm initialData={backcolors} />
      </div>
    </>
  );
};

export default BackcolorPage;
