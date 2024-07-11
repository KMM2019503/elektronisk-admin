import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";

interface SetupLayoutProps {
  children: React.ReactNode;
}

export default async function SetupLayout({ children }: SetupLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: { userId },
  });

  if (store) {
    redirect(`/${store.id}`);
  }

  return <>{children}</>;
}
