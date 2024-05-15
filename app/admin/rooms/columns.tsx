import { deleteRoomAtom } from '@/components/atoms/store';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import Link from 'next/link';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';

export type Room = {
   id: string;
   name: string;
   type: string;
   description: string;
   price_per_night: number;
   image_url: string;
   room_facilities: RoomFacility[];
   room_available: string;
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
   //    {
   //       accessorKey: 'description', // Mengakses data menggunakan key 'description'
   //       header: 'Deskripsi',
   //    },
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
   //    {
   //       id: 'detail', // ID unik untuk kolom
   //       header: 'Detail',
   //       cell: ({ row }) => {
   //          return (
   //             <Link href={`/admin/rooms/${row.original.id}`} passHref>
   //                <button>View Details</button>
   //             </Link>
   //          );
   //       },
   //    },
   {
      accessorKey: 'delete',
      header: 'Aksi',
      cell: ({ row }) => {
         const [, deleteRoom] = useAtom(deleteRoomAtom);
         const handleDelete = async (id: string) => {
            const result = await Swal.fire({
               title: 'Apakah Anda yakin?',
               text: 'Anda tidak akan bisa mengembalikan data ini!',
               icon: 'warning',
               showCancelButton: true,
               confirmButtonColor: '#3085d6',
               cancelButtonColor: '#d33',
               confirmButtonText: 'Ya, hapus!',
               cancelButtonText: 'Batal',
            });

            if (result.isConfirmed) {
               try {
                  await deleteRoom(id);
                  toast.success('Fasilitas berhasil dihapus!', {
                     position: 'top-right',
                     autoClose: 5000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                     theme: 'light',
                  });
               } catch (error) {
                  toast.error('Terjadi kesalahan saat menghapus fasilitas', {
                     position: 'top-right',
                     autoClose: 5000,
                     hideProgressBar: false,
                     closeOnClick: true,
                     pauseOnHover: true,
                     draggable: true,
                     progress: undefined,
                     theme: 'light',
                  });
               }
            }
         };
         return (
            <div className="flex flex-row items-center justify-center gap-4">
               <Button onClick={() => handleDelete(row.original.id)}>Delete</Button>
               <Link href={`/admin/rooms/edit-rooms/${row.original.id}`} passHref>
                  <Button>Edit</Button>
               </Link>
            </div>
         );
      },
   },
];
