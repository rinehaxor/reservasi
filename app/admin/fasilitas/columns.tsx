import { deleteFasilitasAtom } from '@/components/atoms/store';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { useAtom } from 'jotai';

import Link from 'next/link';

export type Fasilitas = {
   id: string;
   name: string;
   image_url: string;
};

export const columnsFasilitas: ColumnDef<Fasilitas>[] = [
   {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.index + 1,
   },
   {
      accessorKey: 'name',
      header: 'Nama Fasilitas',
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
         const [, deleteFasilitas] = useAtom(deleteFasilitasAtom);
         return (
            <div className="flex flex-row items-center justify-center gap-4">
               <Button onClick={() => deleteFasilitas(row.original.id)}>Delete</Button>
               <Link href={`/admin/rooms/edit-rooms/${row.original.id}`} passHref>
                  <Button>Edit</Button>
               </Link>
            </div>
         );
      },
   },
];
