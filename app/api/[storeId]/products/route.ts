import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Image } from "@prisma/client";

export interface ProductRequestBodyType {
  categoryId: string;
  backcolorId: string;
  name: string;
  displaySize: string;
  displayType: string | null;
  cpu: string;
  memory: string;
  mainCamera: string | null;
  selfieCamera: string | null;
  batteryType: string;
  chargingSpeed: string | null;
  price: number;
  isFeatured: boolean;
  isAchived: boolean;
  images: Image[];
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("User not found", { status: 401 });

    const body: ProductRequestBodyType = await req.json();
    const {
      categoryId,
      backcolorId,
      name,
      displaySize,
      displayType,
      cpu,
      memory,
      mainCamera,
      selfieCamera,
      batteryType,
      chargingSpeed,
      price,
      isFeatured,
      isAchived,
      images,
    } = body;

    // Validation
    if (!params.storeId)
      return new NextResponse("Store ID not found", { status: 400 });
    if (!categoryId)
      return new NextResponse("Category ID not found", { status: 400 });
    if (!backcolorId)
      return new NextResponse("Back color ID not found", { status: 400 });
    if (!name) return new NextResponse("Name not found", { status: 400 });
    if (!price) return new NextResponse("Price not found", { status: 400 });
    if (isFeatured === undefined)
      return new NextResponse("Featured status not specified", { status: 400 });
    if (isAchived === undefined)
      return new NextResponse("Achieved status not specified", { status: 400 });
    if (!images || images.length === 0)
      return new NextResponse("Images not found", { status: 400 });
    if (!displaySize)
      return new NextResponse("Display Size not found", { status: 400 });
    if (!cpu) return new NextResponse("CPU Name require", { status: 400 });
    if (!memory)
      return new NextResponse("Memory (Ram & Rom) require", { status: 400 });
    if (!batteryType)
      return new NextResponse("Battery Type require", { status: 400 });

    const store = await prismadb.store.findFirst({
      where: { id: params.storeId, userId },
    });

    if (!store)
      return new NextResponse("Unauthorized to create product", {
        status: 403,
      });

    const category = await prismadb.category.findFirst({
      where: { id: categoryId },
    });
    if (!category)
      return new NextResponse("Invalid category ID", { status: 400 });

    const backcolor = await prismadb.backcolor.findFirst({
      where: { id: backcolorId },
    });
    if (!backcolor)
      return new NextResponse("Invalid back color ID", { status: 400 });

    const product = await prismadb.product.create({
      data: {
        name,
        displaySize,
        displayType,
        cpu,
        memory,
        mainCamera,
        selfieCamera,
        batteryType,
        chargingSpeed,
        price,
        isAchived,
        isFeatured,
        categoryId,
        backcolorId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error at product creation:", error);
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
        status: 400,
      });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
      },
    });

    if (!store) {
      return new NextResponse("Store Not Found", { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const backcolorId = searchParams.get("backcolorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        backcolorId,
        isFeatured: isFeatured ? true : undefined,
        isAchived: false,
      },
      include: {
        category: true,
        backcolor: true,
        images: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.log("🚀 ~ error At get all Categories:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
