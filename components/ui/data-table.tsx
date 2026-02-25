"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Plus, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

const ICONS: Record<string, LucideIcon> = {
  plus: Plus,
};

type DataTableSearch = {
  placeholder: string;
  columns: string[];
};

type DataTableAction = {
  label: string;
  href: string;
  iconName?: keyof typeof ICONS;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  search?: DataTableSearch;
  action?: DataTableAction;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  search,
  action,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState("");

  const searchColumns = useMemo(() => search?.columns ?? [], [search?.columns]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      if (searchColumns.length === 0) {
        return true;
      }

      const filterText = String(filterValue ?? "")
        .trim()
        .toLowerCase();

      if (filterText.length === 0) {
        return true;
      }

      return searchColumns.some((columnId) => {
        const cellValue = row.getValue(columnId);

        if (cellValue === null || cellValue === undefined) {
          return false;
        }

        const cellText = String(cellValue).trim().toLowerCase();

        return cellText.includes(filterText);
      });
    },
    state: {
      globalFilter,
    },
  });

  const Icon = action?.iconName ? ICONS[action.iconName] : null;

  return (
    <div>
      {(search || action) && (
        <div className="flex items-center gap-4 pb-4">
          {search && (
            <Input
              value={globalFilter}
              onChange={(event) =>
                table.setGlobalFilter(String(event.target.value))
              }
              placeholder={search.placeholder}
            />
          )}
          {action && (
            <Button asChild>
              <Link href={action.href}>
                {Icon !== null && <Icon />}
                {action.label}
              </Link>
            </Button>
          )}
        </div>
      )}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader className="bg-sidebar">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
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
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
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
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
