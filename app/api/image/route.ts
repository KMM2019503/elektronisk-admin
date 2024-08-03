import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const { file } = await req.json();

    if (!file) {
      console.error("No file provided in the request");
      return new NextResponse("File not found", { status: 400 });
    }

    const uploadResponse = await cloudinary.uploader.upload(file, {
      upload_preset: "wnbe67jp",
    });

    return NextResponse.json(
      { success: true, url: uploadResponse.secure_url },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error during upload:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
