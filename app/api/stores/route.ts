import prismadb from "@/lib/PrismaDB";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name } = body;

    if (!userId) return new NextResponse("User Id Not Found", { status: 401 });
    if (!name) return new NextResponse("Name Not Found", { status: 400 });

    const storeData: Prisma.StoreCreateInput = {
      name,
      userId,
      updatedAt: new Date(),
    };

    const store = await prismadb.store.create({
      data: storeData,
    });

    return NextResponse.json(store);
  } catch (error) {
    console.log("🚀 ~ error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
