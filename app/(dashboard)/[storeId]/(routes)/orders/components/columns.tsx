"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  BiSolidMessageSquareCheck,
  BiSolidMessageSquareX,
} from "react-icons/bi";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: number;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Prdoucts",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
  },

  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => (
      <div>
        {row.original.isPaid ? (
          <BiSolidMessageSquareCheck className="size-6 text-green-500" />
        ) : (
          <BiSolidMessageSquareX className="size-6 text-red-500" />
        )}
      </div>
    ),
  },
];
