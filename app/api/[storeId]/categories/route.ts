import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// create new Category
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;

    // Checking state
    if (!userId) return new NextResponse("User not found", { status: 401 });
    if (!params.storeId)
      return new NextResponse("User Id Not Found", { status: 401 });
    if (!name) return new NextResponse("Name Not Found", { status: 400 });
    if (!billboardId)
      return new NextResponse("Billboard Id Not Found", { status: 400 });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized Create", { status: 403 });
    }

    const billboard = await prismadb.billboard.findFirst({
      where: {
        id: billboardId,
        storeId: params.storeId,
      },
    });

    if (!billboard) {
      return new NextResponse("Billboard Not Found", { status: 400 });
    }

    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("🚀 ~ error At Category Create:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Get all categories related with the specified storeId
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return new NextResponse("Store Id Not Found In Your Request", {
        status: 401,
      });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!store) {
      return new NextResponse("Store Not Found", { status: 400 });
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        billboard: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log("🚀 ~ error At get all Categories:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
