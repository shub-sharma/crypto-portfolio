"use client";

import Image from "next/image";
import { formatDollar } from "@/utils/crypto-utils";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
export type UserHolding = {
  id: string;
  username: string;
  image: string;
  holding: number;
  "1h %": number;
  "1d %": number;
  "7d %": number;
  "1y %": number;
};

export const columns: ColumnDef<UserHolding>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <div className="text-lg">Name</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="flex flex-col md:flex-row items-center md:gap-3 flex-wrap">
          <Image
            src={row.original.image}
            alt={row.getValue("username")}
            width={80}
            height={80}
            objectFit="cover"
            className="rounded-2xl"
          />
          <div className="flex flex-col md:flex-row md:items-center mt-2 md:mt-0">
            <p className="text-lg text-foreground font-semibold md:mr-2">
              {row.getValue("username")}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "holding",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <div className="text-lg">Holding</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-right text-lg mr-4">
          {formatDollar(row.getValue("holding"), 2)}
        </div>
      );
    },
  },
  {
    accessorKey: "1h %",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <div className="text-lg">1h %</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const percent = parseFloat(row.getValue("1h %"));
      return (
        <div
          className={
            percent < 0
              ? "text-right text-lg text-red-600 mr-4"
              : "text-right text-lg text-green-600 mr-4"
          }
        >
          {percent.toFixed(2)}%
        </div>
      );
    },
  },
  {
    accessorKey: "1d %",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <div className="text-lg">24 %</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const percent = parseFloat(row.getValue("1d %"));
      return (
        <div
          className={
            percent < 0
              ? "text-right text-lg text-red-600 mr-4"
              : "text-right text-lg text-green-600 mr-4"
          }
        >
          {percent.toFixed(2)}%
        </div>
      );
    },
  },

  {
    accessorKey: "7d %",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <div className="text-lg">7d %</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const percent = parseFloat(row.getValue("7d %"));
      return (
        <div
          className={
            percent < 0
              ? "text-right text-lg text-red-600 mr-4"
              : "text-right text-lg text-green-600 mr-4"
          }
        >
          {percent.toFixed(2)}%
        </div>
      );
    },
  },

  {
    accessorKey: "1y %",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <div className="text-lg">1y %</div>
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const percent = parseFloat(row.getValue("1y %"));
      return (
        <div
          className={
            percent < 0
              ? "text-right text-lg text-red-600 mr-4"
              : "text-right text-lg text-green-600 mr-4"
          }
        >
          {percent.toFixed(2)}%
        </div>
      );
    },
  },
];
