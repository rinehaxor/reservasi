import MyDocument from '@/components/admin/Invoice';
import { useUpdateBookingStatus, useUpdatePaymentStatus } from '@/components/atoms/bookingStore';
import { deleteFasilitasAtom, deletePaymentAtom } from '@/components/atoms/store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { createClient } from '@/utils/supabase/client';
import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
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
   rating: number; // Kolom untuk rating individual
   rejection_reason: string;
};

export const columnsBookingsUser = (handleRatingChange: (bookingId: string, roomId: number, newRating: number) => void): ColumnDef<Bookings>[] => [
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
      cell: ({ row }) => {
         const checkinDate = format(new Date(row.original.checkindate), 'yyyy-MM-dd');
         const checkoutDate = format(new Date(row.original.checkoutdate), 'yyyy-MM-dd');
         return (
            <div>
               <div>{checkinDate} / </div>
               <div>{checkoutDate}</div>
            </div>
         );
      },
   },
   {
      accessorKey: 'total_price',
      header: 'Total Harga',
      cell: ({ row }) => `${row.original.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}`,
   },
   {
      id: 'rating',
      header: 'Rating',
      cell: ({ row }) => {
         const [rating, setRating] = useState(row.original.rating);

         const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newRating = parseInt(event.target.value, 10);
            setRating(newRating);
            handleRatingChange(row.original.id, row.original.room_id, newRating);
         };
         const canRate = row.original.booking_status === 'Check-Out' && row.original.payment_status === 'Disetujui';
         return (
            <Dialog>
               <DialogTrigger asChild>
                  <Button variant="outline" disabled={!canRate}>
                     Rating
                  </Button>
               </DialogTrigger>
               <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                     <DialogTitle className="text-center font-bold text-xl">Beri Nilai Reservasi</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                     <RadioGroup
                        value={rating?.toString()}
                        onValueChange={(value) => {
                           const newRating = parseInt(value, 10);
                           setRating(newRating);
                           handleRatingChange(row.original.id, row.original.room_id, newRating);
                        }}
                     >
                        <div className="flex felx-row gap-5 items-center justify-center">
                           <div className="flex flex-col items-center ">
                              <RadioGroupItem value="1" id="r1" className="w-5 h-5" />
                              <Label htmlFor="r1" className="text-lg">
                                 1
                              </Label>
                           </div>
                           <div className="flex flex-col items-center ">
                              <RadioGroupItem value="2" id="r2" className="w-5 h-5" />
                              <Label htmlFor="r2" className="text-lg">
                                 2
                              </Label>
                           </div>
                           <div className="flex flex-col items-center ">
                              <RadioGroupItem value="3" id="r3" className="w-5 h-5" />
                              <Label htmlFor="r3" className="text-lg">
                                 3
                              </Label>
                           </div>
                           <div className="flex flex-col items-center ">
                              <RadioGroupItem value="4" id="r4" className="w-5 h-5" />
                              <Label htmlFor="r4" className="text-lg">
                                 4
                              </Label>
                           </div>
                           <div className="flex flex-col items-center ">
                              <RadioGroupItem value="5" id="r5" className="w-5 h-5" />
                              <Label htmlFor="r5" className="text-lg">
                                 5
                              </Label>
                           </div>
                        </div>
                     </RadioGroup>
                  </div>
                  <DialogFooter></DialogFooter>
               </DialogContent>
            </Dialog>
         );
      },
   },
   {
      id: 'Aksi',
      header: 'Aksi',
      cell: ({ row }) => {
         const [isPreviewOpen, setIsPreviewOpen] = useState(false);

         //  const updatePaymentStatus = useUpdatePaymentStatus();
         //  const updateBookingStatus = useUpdateBookingStatus();
         return (
            <div className="flex flex-row items-center justify-center gap-4">
               <PDFDownloadLink document={<MyDocument bookingData={row.original} />} fileName={`booking-${row.original.id}.pdf`}>
                  {({ loading }) => (loading ? 'Preparing document...' : <Button variant={'secondary'}>Download Invoice </Button>)}
               </PDFDownloadLink>
               {row.original.payment_status === 'Ditolak' && (
                  <Dialog>
                     <DialogTrigger asChild>
                        <Button className="bg-red-500 text-white hover:bg-red-700">Alasan Penolakan</Button>
                     </DialogTrigger>
                     <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                           <DialogTitle className="text-center font-bold text-xl">Alasan Penolakan</DialogTitle>
                        </DialogHeader>
                        <div className="font-bold ">{row.original.rejection_reason === null ? 'Hubungi Pihak Hotel.' : 'Hubungi Pihak Hotel.'}</div>
                        <DialogFooter></DialogFooter>
                     </DialogContent>
                  </Dialog>
               )}
            </div>
         );
      },
   },
];
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
