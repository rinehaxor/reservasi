import { deleteFasilitasAtom } from '@/components/atoms/store';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { HiPencil } from 'react-icons/hi';
import { HiTrash } from 'react-icons/hi';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
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
                  await deleteFasilitas(id);
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
               <Button onClick={() => handleDelete(row.original.id)} variant={'destructive'}>
                  <HiTrash /> Delete
               </Button>
               <Link href={`/admin/fasilitas/edit-fasilitas/${row.original.id}`} passHref>
                  <Button variant={'yellow'}>
                     <HiPencil /> Edit
                  </Button>
               </Link>
            </div>
         );
      },
   },
];
