import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type PaginationState,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export function DataTable<TData>({
  columns,
  data,
  className,
  pageSize = 4,
  paginationLabel = (pageIndex, pageCount) => (
    <>
      <span className="text-[#5e584b] text-xs leading-4 tracking-[0.2px]">Page</span>
      <span className="inline-flex items-center justify-center h-6 min-w-10 border border-[#d6ceb8] rounded-xs px-2 text-[#161410] text-xs leading-4 tracking-[0.2px]">
        {pageIndex + 1}
      </span>
      <span className="text-[#5e584b] text-xs leading-4 tracking-[0.2px]">
        of {pageCount}
      </span>
    </>
  ),
}: {
  columns: ColumnDef<TData, any>[]
  data: TData[]
  className?: string
  pageSize?: number
  paginationLabel?: (pageIndex: number, pageCount: number) => React.ReactNode
}) {
  const [{ pageIndex, pageSize: currentPageSize }, setPagination] =
    React.useState<PaginationState>({ pageIndex: 0, pageSize })

  const table = useReactTable({
    data,
    columns,
    state: { pagination: { pageIndex, pageSize: currentPageSize } },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  return (
    <div className={cn("w-full", className)}>
      <Table>
        <TableHeader className="bg-[#f6f2e6] border-b border-[#e8e2d2]">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-[#e8e2d2]">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="h-12 px-3 text-[#121619] text-sm font-medium leading-5 tracking-[0.1px]"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="bg-[#fffbf0] border-b border-[#e8e2d2]"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-3 py-0 h-16 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="bg-[#f6f2e6] h-12 w-full flex items-center justify-end px-3">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            {paginationLabel(table.getState().pagination.pageIndex, table.getPageCount())}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              className="border border-[#d6ceb8] bg-transparent hover:bg-[#e8e2d2]"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous page"
            >
              <span className="text-[#161410] text-xs leading-none">‹</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon-xs"
              className="border border-[#d6ceb8] bg-transparent hover:bg-[#e8e2d2]"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              aria-label="Next page"
            >
              <span className="text-[#161410] text-xs leading-none">›</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

