"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  BiSolidMessageSquareCheck,
  BiSolidMessageSquareX,
} from "react-icons/bi";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

import CellAction from "./CellAction";
import { Button } from "@/components/ui/button";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Product = {
  id: string;
  name: string;
  price: number;
  isFeatured: boolean;
  isArchived: boolean;
  createdAt: string;
  category: string;
  backcolor: string;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "category",
    header: "Category Name",
  },
  {
    accessorKey: "backcolor",
    header: "Back Color",
    cell: ({ row }) => (
      <div className="flex items-center justify-start">
        <div
          className="size-6 rounded-full"
          style={{ backgroundColor: row.original.backcolor }}
        />
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>
        <p>{row.original.price} $</p>
      </div>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (
      <div>
        {row.original.isFeatured ? (
          <BiSolidMessageSquareCheck className="size-6 text-green-500" />
        ) : (
          <BiSolidMessageSquareX className="size-6 text-red-500" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) => (
      <div>
        {row.original.isArchived ? (
          <BiSolidMessageSquareCheck className="size-6 text-green-500" />
        ) : (
          <BiSolidMessageSquareX className="size-6 text-red-500" />
        )}
      </div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
  },
  {
    accessorKey: "",
    header: "Action",
    cell: ({ row }) => <CellAction id={row.original.id} />,
  },
];
