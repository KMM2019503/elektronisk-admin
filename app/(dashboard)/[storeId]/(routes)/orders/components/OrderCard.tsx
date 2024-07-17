"use client";

import { useParams, useRouter } from "next/navigation";

import {
  OrderItem as OrderItemType,
  Order as OrderType,
  Product,
} from "@prisma/client";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderItem extends OrderItemType {
  product: Product;
}

interface Order extends OrderType {
  orderItem: OrderItem[];
}

interface Orderprops {
  order: Order;
}

const OrderCard = ({ order }: Orderprops) => {
  const router = useRouter();
  const params = useParams();

  return (
    <div>
      <Card className="max-w-[350px]">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center justify-around gap-3 md:gap-0">
            <div className="flex flex-col gap-2">
              <CardTitle>{order.isPaid ? "Paid" : "Not Paid"}</CardTitle>
              {/* <CardDescription>
                <div className="flex items-center gap-2 font-bold">
                  Color: {order.orderItems.product.price}
                  <div
                    className="size-6 rounded-full"
                    style={{ backgroundColor: order.value }}
                  ></div>
                </div>
              </CardDescription> */}
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
};

export default OrderCard;
