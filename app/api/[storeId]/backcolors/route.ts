import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

// create new colors
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { color, value } = body;

    // Checking state
    if (!userId) return new NextResponse("User not found", { status: 401 });
    if (!params.storeId)
      return new NextResponse("User Id Not Found", { status: 401 });
    if (!color) return new NextResponse("Color Not Found", { status: 400 });
    if (!value) return new NextResponse("Value Not Found", { status: 400 });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized Create", { status: 403 });
    }

    const backcolor = await prismadb.backcolor.create({
      data: {
        value,
        color,
        storeId: params.storeId,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(backcolor);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Get all backcolors related with the specified storeId
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

    const backcolors = await prismadb.backcolor.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(backcolors);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
