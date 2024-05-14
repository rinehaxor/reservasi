import { useUpdateRoomStatus } from '@/components/atoms/roomStore';
import { deleteRoomAtom } from '@/components/atoms/store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
   room_facilities: RoomFacility[];
};
export type RoomFacility = {
   facility_id: number;
   facility: Facility;
};
interface Facility {
   id: number;
   name: string;
   image_url: string;
}

export const columnsRoomAvailable: ColumnDef<Room>[] = [
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
      accessorKey: 'price_per_night', // Mengakses data menggunakan key 'price_per_night'
      header: 'Harga ',
      cell: ({ row }) => `${row.original.price_per_night.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`,
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
      accessorKey: 'room_available',
      header: 'Ketersdiaan Kamar',
   },

   {
      accessorKey: 'Action',
      header: 'Aksi',
      cell: ({ row }) => {
         const updateRoomStatus = useUpdateRoomStatus();
         return (
            <div className="flex flex-row items-center justify-center gap-4">
               <Dialog>
                  <DialogTrigger asChild>
                     <Button variant="outline">Ketersediaan</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                        <DialogTitle>Ketersediaan Kamar</DialogTitle>
                        <DialogDescription>Ubah Informasi Status Kamar menjadi Tersedia / Tidak Tersedia</DialogDescription>
                     </DialogHeader>
                     <div className="grid gap-4 py-4"></div>
                     <DialogFooter>
                        <Button onClick={() => updateRoomStatus(row.original.id, 'Tidak Tersedia')} type="submit">
                           Tidak Tersedia
                        </Button>
                        <Button onClick={() => updateRoomStatus(row.original.id, 'Tersedia')} type="submit">
                           Tersedia
                        </Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
            </div>
         );
      },
   },
];
