import { deleteFasilitasAtom, deletePaymentAtom } from '@/components/atoms/store';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { useAtom } from 'jotai';

import Link from 'next/link';

export type Payment = {
   id: string;
   bank_name: string;
   image_url: string;
   account_number: number;
};

export const columnsPayment: ColumnDef<Payment>[] = [
   {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.index + 1,
   },
   {
      accessorKey: 'bank_name',
      header: 'Nama Pembayaran',
   },
   {
      accessorKey: 'image_url',
      header: 'Gambar',
      cell: ({ getValue }) => {
         const url: string = getValue() as string;
         return <img src={url} alt="Facility Image" style={{ width: '100px', height: 'auto' }} />;
      },
   },
   {
      accessorKey: 'delete',
      header: 'Aksi',
      cell: ({ row }) => {
         const [, deletePayment] = useAtom(deletePaymentAtom);
         return (
            <div className="flex flex-row items-center justify-center gap-4">
               <Button onClick={() => deletePayment(row.original.id)}>Delete</Button>
               <Link href={`/admin/fasilitas/edit-payment/${row.original.id}`} passHref>
                  <Button>Edit</Button>
               </Link>
            </div>
         );
      },
   },
];
