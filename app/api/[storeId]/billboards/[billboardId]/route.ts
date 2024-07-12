import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get billboard with unique ID
export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    const billboard = await prismadb.billboard.findMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Update Billboards
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imgUrl } = body;

    if (!userId) return new NextResponse("User not found", { status: 401 });

    // Checking state
    if (!params.storeId)
      return new NextResponse("Store Id Not Found", { status: 401 });
    if (!params.billboardId)
      return new NextResponse("billboard Id Not Found", { status: 400 });

    if (!label) return new NextResponse("Label Not Found", { status: 400 });
    if (!imgUrl) return new NextResponse("Image Not Found", { status: 400 });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized Update", { status: 403 });
    }

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label: label,
        imgUrl: imgUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Delte billboard
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("User Id Not Found", { status: 401 });
    }

    if (!params.storeId)
      return new NextResponse("Store Id Not Found", { status: 401 });
    if (!params.billboardId)
      return new NextResponse("billboard Id Not Found", { status: 400 });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized Delete", { status: 403 });
    }

    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.error("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
