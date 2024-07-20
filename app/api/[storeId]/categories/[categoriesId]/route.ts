import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get Category by unique ID
export async function GET(
  req: Request,
  { params }: { params: { categoriesId: string } }
) {
  try {
    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoriesId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Update Category
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoriesId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) return new NextResponse("User not found", { status: 401 });

    // Checking state
    if (!params.storeId)
      return new NextResponse("Store Id Not Found", { status: 401 });
    if (!params.categoriesId)
      return new NextResponse("Category Id Not Found", { status: 400 });

    if (!name)
      return new NextResponse("Category Name Not Found", { status: 400 });
    if (!billboardId)
      return new NextResponse("Billboard Id Not Found", { status: 400 });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized Update", { status: 403 });
    }

    const billboard = await prismadb.billboard.findFirst({
      where: {
        id: billboardId,
      },
    });

    if (!billboard) {
      return new NextResponse("Billboard Not Found", { status: 400 });
    }

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoriesId,
      },
      data: {
        name: name,
        billboardId: billboardId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Delte Category
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoriesId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("User Id Not Found", { status: 401 });
    }

    if (!params.storeId)
      return new NextResponse("Store Id Not Found", { status: 401 });
    if (!params.categoriesId)
      return new NextResponse("Category Id Id Not Found", { status: 400 });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized Delete", { status: 403 });
    }

    const category = await prismadb.category.deleteMany({
      where: {
        id: params.categoriesId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("🚀 ~ error At Category Detele:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
