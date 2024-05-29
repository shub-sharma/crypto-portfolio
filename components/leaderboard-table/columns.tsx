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
  total_holdings_value: number;
  one_hour_change_percentage: number;
  one_day_change_percentage: number;
  seven_day_change_percentage: number;
  one_year_change_percentage: number;
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
    accessorKey: "total_holdings_value",
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
          {formatDollar(row.getValue("total_holdings_value"), 2)}
        </div>
      );
    },
  },
  {
    accessorKey: "one_hour_change_percentage",
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
      const percent = parseFloat(row.getValue("one_hour_change_percentage"));
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
    accessorKey: "one_day_change_percentage",
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
      const percent = parseFloat(row.getValue("one_day_change_percentage"));
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
    accessorKey: "seven_day_change_percentage",
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
      const percent = parseFloat(row.getValue("seven_day_change_percentage"));
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
    accessorKey: "one_year_change_percentage",
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
      const percent = parseFloat(row.getValue("one_year_change_percentage"));
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
