import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) return new NextResponse("User Id Not Found", { status: 401 });
    if (!name) return new NextResponse("Name Not Found", { status: 400 });
    if (!params.storeId)
      return new NextResponse("Store Id Not Found", { status: 400 });

    const store = await prismadb.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("User Id Not Found", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store Id Not Found", { status: 400 });
    }

    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
