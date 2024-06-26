"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  userRedirect: any;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  userRedirect,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const { toast } = useToast();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
    meta: {
      editTrade: (id: string) => {
        router.push(`/trade/${id}`);
      },
      deleteTrade: (tickerId: string) => {
        const hasConfirmed = confirm(
          `Are you sure you want to delete ${tickerId}?`
        );

        if (hasConfirmed) {
          try {
            const response = fetch(`/api/trade/${tickerId}`, {
              method: "DELETE",
            });

            if (response.ok) {
              toast({
                description: "Successfully deleted",
              });
            }
            location.reload();
          } catch (error) {
            toast({
              variant: "destructive",
              description: "Something went wrong while deleting",
            });
          }
        }
      },
    },
  });

  const { user } = useUser();

  const determineInitialProfileState = () => {
    const containsUsername = data.some(
      (item) => item.username === user?.firstName
    );
    return containsUsername ? true : false;
  };

  const [isProfilePublic, setisProfilePublic] = useState(
    determineInitialProfileState
  );

  const handleToggle = async () => {
    setisProfilePublic(!isProfilePublic);
    try {
      const response = await fetch(
        `/api/trade/profile/public/${!isProfilePublic}`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        router.push("/ranking");

        toast({
          description: "Successfully updated profile visibility",
        });
      }
      // router.refresh();
      // router.push("/ranking");
      location.reload();
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Something went wrong while deleting",
      });
    }
  };

  return (
    <div>
      <div className="block sm:flex sm:items-center justify-between py-4">
        <Input
          placeholder="Search investor's name..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />

        <div className="sm:flex justify-between items-center gap-x-3">
          <Button
            variant="outline"
            onClick={handleToggle}
            className={`ml-auto px-4 py-2 ${
              isProfilePublic ? "bg-red-400" : "bg-blue-400"
            }`}
          >
            {isProfilePublic ? " Set profile private" : "Set profile public"}
            <User className="h-4 w-4 ml-2" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  onClick={() => userRedirect(row.original)}
                  className="cursor-pointer"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
