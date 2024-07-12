import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

// create new billboard
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imgUrl } = body;

    // Checking state
    if (!userId) return new NextResponse("User not found", { status: 401 });
    if (!params.storeId)
      return new NextResponse("User Id Not Found", { status: 401 });
    if (!label) return new NextResponse("Label Not Found", { status: 400 });
    if (!imgUrl) return new NextResponse("Image Not Found", { status: 400 });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized Create", { status: 403 });
    }

    const billboard = await prismadb.billboard.create({
      data: {
        label,
        imgUrl,
        storeId: params.storeId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Get all billboards related with the specified storeId
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return new NextResponse("User Id Not Found", { status: 401 });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!store) {
      return new NextResponse("Store Not Found", { status: 400 });
    }

    const billboard = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
