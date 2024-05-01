import { deleteRoomAtom } from '@/components/atoms/store';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import Link from 'next/link';

export type Room = {
   id: string;
   name: string;
   type: string;
   description: string;
   price_per_night: number;
   image_url: string;
};

export const columns: ColumnDef<Room>[] = [
   {
      id: 'no', // Custom ID for the column
      header: 'No',
      cell: ({ row }) => row.index + 1, // Menggunakan index dari row, ditambah 1
   },
   {
      accessorKey: 'name', // Mengakses data menggunakan key 'name'
      header: 'Nama',
   },
   {
      accessorKey: 'type', // Mengakses data menggunakan key 'type'
      header: 'Tipe',
   },
   {
      accessorKey: 'description', // Mengakses data menggunakan key 'description'
      header: 'Deskripsi',
   },
   {
      accessorKey: 'price_per_night', // Mengakses data menggunakan key 'price_per_night'
      header: 'Harga per malam',
   },
   {
      accessorKey: 'image_url',
      header: 'Gambar',
      cell: ({ getValue }) => {
         const url: string = getValue() as string; // Type assertion here
         return <img src={url} alt="Room Image" style={{ width: '100px', height: 'auto' }} />;
      },
   },
   {
      id: 'detail', // ID unik untuk kolom
      header: 'Detail',
      cell: ({ row }) => {
         return (
            <Link href={`/admin/rooms/${row.original.id}`} passHref>
               <button>View Details</button>
            </Link>
         );
      },
   },
   {
      accessorKey: 'delete',
      header: 'Aksi',
      cell: ({ row }) => {
         const [, deleteRoom] = useAtom(deleteRoomAtom);
         return (
            <div className="flex flex-row items-center justify-center gap-4">
               <Button onClick={() => deleteRoom(row.original.id)}>Delete</Button>
               <Link href={`/admin/rooms/edit-rooms/${row.original.id}`} passHref>
                  <Button>Edit</Button>
               </Link>
            </div>
         );
      },
   },
];
