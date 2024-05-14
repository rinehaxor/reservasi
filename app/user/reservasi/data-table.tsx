'use client';

import React, { useState } from 'react';
import { ColumnDef, flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

interface DataTableProps<TData, TValue> {
   columns: ColumnDef<TData, TValue>[];
   data: TData[];
}

export function DataTableUser<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
   const [pagination, setPagination] = useState({
      pageIndex: 0, // Initially on the first page
      pageSize: 5, // Display 5 data items per page
   });

   const table = useReactTable({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: setPagination,
      state: {
         pagination,
      },
   });

   return (
      <div>
         <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-full">
               <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                     <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                           <TableHead key={header.id} className="bg-orange-500 text-white p-3 text-center">
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                           </TableHead>
                        ))}
                     </TableRow>
                  ))}
               </TableHeader>
               <TableBody>
                  {table.getRowModel().rows.map((row) => (
                     <TableRow key={row.id} className="bg-gray-100 hover:bg-gray-200">
                        {row.getVisibleCells().map((cell) => (
                           <TableCell key={cell.id} className="p-3 text-center">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                           </TableCell>
                        ))}
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
         <div className="pagination flex justify-end items-center gap-2 mt-5">
            <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
               Previous
            </Button>
            <span>
               Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
               Next
            </Button>
         </div>
      </div>
   );
}
