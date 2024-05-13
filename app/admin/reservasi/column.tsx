import { useUpdateBookingStatus, useUpdatePaymentStatus } from '@/components/atoms/bookingStore';
import { deleteFasilitasAtom, deletePaymentAtom } from '@/components/atoms/store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/utils/supabase/client';
import { ColumnDef } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import Image from 'next/image';

import Link from 'next/link';
import { useState } from 'react';

export type Bookings = {
   id: string;
   room_id: number;
   bank_name: string;
   image_url: string;
   account_number: number;
   booking_status: string;
   payment_status: string;
   total_price: number;
   invoice_number: string;
   name: string;
   checkindate: any;
   checkoutdate: any;
   payment_proof_url: string;
};

//handle aprove pembayran

export const columnsBookings: ColumnDef<Bookings>[] = [
   {
      id: 'no',
      header: 'No',
      cell: ({ row }) => row.index + 1,
   },
   {
      accessorKey: 'invoice_number',
      header: 'Nomor Invoice',
   },
   {
      accessorKey: 'room.name',
      header: 'Jenis Kamar',
   },

   {
      accessorKey: 'booking_status',
      header: 'Status Reservasi',
      cell: ({ row }) => {
         let bgColor;
         switch (row.original.booking_status) {
            case 'Check-Out':
               bgColor = 'bg-red-500';
               break;
            case 'Check-In':
               bgColor = 'bg-green-500';
               break;
            case 'Cancel':
               bgColor = 'bg-red-500';
               break;
            default:
               bgColor = 'bg-yellow-500';
         }
         return <span className={`${bgColor} text-white font-bold p-2 rounded-xl`}>{row.original.booking_status}</span>;
      },
   },
   {
      accessorKey: 'payment_status',
      header: 'Status Pembayaran',
      cell: ({ row }) => {
         let bgColor;
         switch (row.original.payment_status) {
            case 'Ditolak':
               bgColor = 'bg-red-500';
               break;
            case 'Disetujui':
               bgColor = 'bg-green-500';
               break;
            default:
               bgColor = 'bg-yellow-500';
         }
         return <span className={`${bgColor} text-white font-bold p-2 rounded-xl`}>{row.original.payment_status}</span>;
      },
   },

   {
      id: 'dates',
      header: 'Tgl. Checkin / Tgl. Checkout',
      cell: ({ row }) => `${row.original.checkindate} / ${row.original.checkoutdate}`,
   },
   {
      accessorKey: 'total_price',
      header: 'Total Harga',
      cell: ({ row }) => `${row.original.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`,
   },
   {
      id: 'Aksi',
      header: 'Aksi',
      cell: ({ row }) => {
         const [isOpen, setIsOpen] = useState(false);

         const updatePaymentStatus = useUpdatePaymentStatus();
         const updateBookingStatus = useUpdateBookingStatus();
         return (
            <div className="flex flex-row items-center justify-center gap-4">
               <Dialog>
                  <DialogTrigger asChild>
                     <Button variant="outline">Pembayaran</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                        <DialogTitle>Pembayaran</DialogTitle>
                     </DialogHeader>
                     <div className="grid gap-4 py-4">
                        <Image src={row.original.payment_proof_url} alt="Room Image" width={500} height={400} />
                     </div>
                     <DialogFooter>
                        <Button onClick={() => updatePaymentStatus(row.original.id, 'Disetujui')} type="submit">
                           Setujui
                        </Button>
                        <Button onClick={() => updatePaymentStatus(row.original.id, 'Ditolak')} type="submit">
                           Tolak
                        </Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
               <Dialog>
                  <DialogTrigger asChild>
                     <Button variant="outline">Reservasi</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                     <DialogHeader>
                        <DialogTitle>Reservasi</DialogTitle>
                        <DialogDescription>Ubah Informasi Booking Status Check In / Check Out / Cancel</DialogDescription>
                     </DialogHeader>
                     <div className="grid gap-4 py-4"></div>
                     <DialogFooter>
                        <Button onClick={() => updateBookingStatus(row.original.id, 'Check-In')} type="submit">
                           Check-In
                        </Button>
                        <Button onClick={() => updateBookingStatus(row.original.id, 'Check-Out')} type="submit">
                           Check-Out
                        </Button>
                        <Button onClick={() => updateBookingStatus(row.original.id, 'Cancel')} type="submit">
                           Cancel
                        </Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
            </div>
         );
      },
   },
   //    {
   //       accessorKey: 'image_url',
   //       header: 'Gambar',
   //       cell: ({ getValue }) => {
   //          const url: string = getValue() as string;
   //          return <img src={url} alt="Facility Image" style={{ width: '100px', height: 'auto' }} />;
   //       },
   //    },
   //    {
   //       accessorKey: 'delete',
   //       header: 'Aksi',
   //       cell: ({ row }) => {
   //          const [, deletePayment] = useAtom(deletePaymentAtom);
   //          return (
   //             <div className="flex flex-row items-center justify-center gap-4">
   //                <Button onClick={() => deletePayment(row.original.id)}>Delete</Button>
   //                <Link href={`/admin/fasilitas/edit-payment/${row.original.id}`} passHref>
   //                   <Button>Edit</Button>
   //                </Link>
   //             </div>
   //          );
   //       },
   //    },
];
