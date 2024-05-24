"use client";

import Image from "next/image";
import { formatDollar } from "@/utils/crypto-utils";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type Holding = {
  id: string;
  price_usd: number;
  symbol: string;
  image: string;
  name: string;
  amount: number;
  usd_1h_percent_change: number;
  usd_24h_percent_change: number;
  usd_7d_percent_change: number;
};

export const columns: ColumnDef<Holding>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <div>
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
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
            alt={row.getValue("name")}
            width={40}
            height={40}
            objectFit="cover"
            className="rounded-full"
          />
          <div className="flex flex-col md:flex-row md:items-center mt-2 md:mt-0">
            <p className="text-sm text-foreground font-bold md:mr-2">
              {row.getValue("name")}
            </p>
            <p className="text-sm text-muted-foreground">
              {row.original.symbol.toUpperCase()}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "price_usd",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Price
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const costBasis = parseFloat(row.getValue("price_usd"));
      return (
        <div className="text-right font-small mr-4">
          {formatDollar(costBasis)}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      return <div className="text-right font-small mr-4">{amount}</div>;
    },
  },
  {
    accessorKey: "amount_in_usd",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Holding
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const total = parseFloat(row.getValue("amount_in_usd"));
      return (
        <div className="text-right font-small mr-4">
          {formatDollar(total, 2)}
        </div>
      );
    },
  },
  {
    accessorKey: "costBasis",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Cost
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const costBasis = parseFloat(row.getValue("costBasis"));
      return (
        <div className="text-right font-small mr-4">
          {formatDollar(costBasis)}
        </div>
      );
    },
  },

  {
    accessorKey: "net_profit",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Net Profit
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const net = parseFloat(row.getValue("net_profit"));

      return (
        <div
          className={
            net < 0
              ? "text-right font-small text-red-500 mr-4"
              : "text-right font-small text-green-500 mr-4"
          }
        >
          {formatDollar(net, 2)}
        </div>
      );
    },
  },

  {
    accessorKey: "usd_24h_percent_change",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            24h %
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const percent = parseFloat(
        row.getValue("usd_24h_percent_change")
      ).toFixed(2);
      return (
        <div
          className={
            percent < 0
              ? "text-right font-small text-red-500 mr-4"
              : "text-right font-small text-green-500 mr-4"
          }
        >
          {percent}%
        </div>
      );
    },
  },
  {
    accessorKey: "usd_7d_percent_change",
    header: ({ column }) => {
      return (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            7d %
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const percent = parseFloat(row.getValue("usd_7d_percent_change")).toFixed(
        2
      );
      return (
        <div
          className={
            percent < 0
              ? "text-right font-small text-red-500 mr-4"
              : "text-right font-small text-green-500 mr-4"
          }
        >
          {percent}%
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const holdingData = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                table.options?.meta?.editTrade(holdingData.tradeId)
              }
            >
              <div className="w-full flex flex-wrap justify-between ">
                <p>Edit </p>
                <Pencil className="w-4 h-4 ml-2" />
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => table.options?.meta?.deleteTrades(holdingData.id)}
            >
              <div className="w-full flex flex-wrap justify-between ">
                <p>Delete </p>
                <Trash2 className="w-4 h-4 ml-2" />
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
