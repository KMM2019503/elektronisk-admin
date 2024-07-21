import Stripe from "stripe";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import prismadb from "@/lib/PrismaDB";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET_KEY!
    );

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ];

    const addressString = addressComponents.filter((c) => c !== null).join(",");

    if (event.type === "checkout.session.completed") {
      const order = await prismadb.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || "",
        },
        include: {
          orderItem: true,
        },
      });

      const productsIds = order?.orderItem.map(
        (orderItem) => orderItem.productId
      );

      await prismadb.product.updateMany({
        where: {
          id: {
            in: [...productsIds],
          },
        },
        data: {
          isAchived: true,
        },
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error: any) {
    return new NextResponse(`Webhook Error : ${error.message}`, {
      status: 400,
    });
  }
}
