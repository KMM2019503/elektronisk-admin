import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { ProductRequestBodyType } from "../route";
import { Image } from "@prisma/client";

// Get Product by unique ID
export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const product = await prismadb.product.findFirst({
      where: {
        id: params.productId,
      },
    });

    if (!product) {
      return new NextResponse("Invalid Product", {
        status: 401,
      });
    }

    const images = await prismadb.image.findMany({
      where: {
        productId: product.id,
      },
    });

    const productWithImages = {
      ...product,
      images,
    };

    return NextResponse.json(productWithImages);
  } catch (error) {
    console.log("🚀 ~ error At Get Product by unique ID:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Update Category
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("User not found", { status: 401 });
    const body: ProductRequestBodyType = await req.json();
    const {
      categoryId,
      backcolorId,
      name,
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

    const product = await prismadb.product.updateMany({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        isAchived,
        isFeatured,
        categoryId,
        backcolorId,
        storeId: params.storeId,
        updatedAt: new Date(),
      },
    });

    if (!product) {
      return new NextResponse("Product Update process Fail", { status: 400 });
    }

    await Promise.all(
      images.map(async (image: Image) => {
        await prismadb.image.updateMany({
          data: {
            url: image.url,
            productId: params.productId,
          },
        });
      })
    );

    return NextResponse.json(product);
  } catch (error) {
    console.log("🚀 ~ error at product update process:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Delte Products
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("User Id Not Found", { status: 401 });
    }

    if (!params.storeId)
      return new NextResponse("Store Id Not Found", { status: 401 });
    if (!params.productId)
      return new NextResponse("Product Id Id Not Found", { status: 400 });

    const store = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId: userId,
      },
    });

    if (!store) {
      return new NextResponse("Unauthorized Delete", { status: 403 });
    }

    const product = await prismadb.product.findFirst({
      where: {
        id: params.productId,
        storeId: params.storeId,
      },
    });

    if (!product) {
      return new NextResponse("Invalid Product", { status: 403 });
    }

    const res = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(res);
  } catch (error) {
    console.error("🚀 ~ error At Product Detele:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
