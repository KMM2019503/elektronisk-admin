import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Get backcolor with unique ID
export async function GET(
  req: Request,
  { params }: { params: { backcolorId: string } }
) {
  try {
    const backcolor = await prismadb.backcolor.findUnique({
      where: {
        id: params.backcolorId,
      },
    });

    return NextResponse.json(backcolor);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Update backcolor
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; backcolorId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { color, value } = body;

    if (!userId) return new NextResponse("User not found", { status: 401 });

    // Checking state
    if (!params.storeId)
      return new NextResponse("Store Id Not Found", { status: 401 });
    if (!params.backcolorId)
      return new NextResponse("Backcolor Id Not Found", { status: 400 });

    if (!color) return new NextResponse("Color Not Found", { status: 400 });
    if (!value) return new NextResponse("Value Not Found", { status: 400 });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized Update", { status: 403 });
    }

    const backcolor = await prismadb.backcolor.updateMany({
      where: {
        id: params.backcolorId,
      },
      data: {
        color: color,
        value: value,
      },
    });

    return NextResponse.json(backcolor);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Delte Backcolor
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; backcolorId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("User Id Not Found", { status: 401 });
    }

    if (!params.storeId)
      return new NextResponse("Store Id Not Found", { status: 401 });
    if (!params.backcolorId)
      return new NextResponse("Backcolor Id Not Found", { status: 400 });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized Delete", { status: 403 });
    }

    const backcolor = await prismadb.backcolor.deleteMany({
      where: {
        id: params.backcolorId,
      },
    });

    return NextResponse.json(backcolor);
  } catch (error) {
    console.error("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
