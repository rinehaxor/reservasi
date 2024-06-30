import MyDocument from '@/components/admin/Invoice';
import { useUpdateBookingStatus, useUpdatePaymentStatus } from '@/components/atoms/bookingStore';
import { deleteFasilitasAtom, deletePaymentAtom } from '@/components/atoms/store';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { createClient } from '@/utils/supabase/client';
import { BlobProvider, PDFDownloadLink } from '@react-pdf/renderer';
import { ColumnDef } from '@tanstack/react-table';
import { useAtom } from 'jotai';
import Image from 'next/image';

import Link from 'next/link';
import { useState } from 'react';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { TiDeleteOutline } from 'react-icons/ti';
import { FaMoneyBillWaveAlt } from 'react-icons/fa';
import { MdOutlineBedroomChild } from 'react-icons/md';
import { LuCalendarCheck } from 'react-icons/lu';
import { RiCalendarCloseLine } from 'react-icons/ri';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

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
   phone_number: number;
   name: string;
   checkindate: any;
   checkoutdate: any;
   payment_proof_url: string;
   rejection_reason: string;
   room: {
      name: string;
   };
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
         const [isPreviewOpen, setIsPreviewOpen] = useState(false);
         //  const [rejectionReason, setRejectionReason] = useState(row.original.rejection_reason || '');
         //  const [guestName, setGuestName] = useState(row.original.name || '');
         //  const [guestPhone, setGuestPhone] = useState(row.original.phone_number || '');
         const [showReasonInput, setShowReasonInput] = useState(false);
         const [showGuestInput, setShowGuestInput] = useState(false);
         const {
            register,
            handleSubmit,
            setValue,
            formState: { errors },
         } = useForm({
            defaultValues: {
               guestName: row.original.name || '',
               guestPhone: row.original.phone_number || '',
               rejectionReason: row.original.rejection_reason || '',
            },
         });

         const updateGuestInfo = async (bookingId: any, name: any, phone: any) => {
            const supabase = createClient();
            const { error } = await supabase.from('bookings').update({ name, phone_number: phone }).eq('id', bookingId);
            if (!error) {
               row.original.name = name;
               row.original.phone_number = phone;
               window.location.reload();
            }
         };

         const updatePaymentStatus = useUpdatePaymentStatus();
         const updateBookingStatus = useUpdateBookingStatus();
         const handleReject = (data: any) => {
            updatePaymentStatus(row.original.id, 'Ditolak', data.rejectionReason);
            window.location.reload();
         };
         const handleSaveGuestInfo = (data: any) => {
            updateGuestInfo(row.original.id, data.guestName, data.guestPhone);
            setShowGuestInput(false);
            window.location.reload();
         };

         return (
            <div className="flex flex-row items-center justify-center gap-4 ">
               <Dialog>
                  <DialogTrigger asChild>
                     <Button variant="outline">
                        <MdOutlineBedroomChild className="w-5 h-5 mr-2" />
                        Reservasi
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] ">
                     <DialogHeader>
                        <DialogTitle>Reservasi</DialogTitle>
                        <DialogDescription>Ubah Informasi Booking Status Check In / Check Out / Cancel</DialogDescription>
                     </DialogHeader>
                     <div className="grid gap-4 py-4">
                        <Button variant={'secondary'} onClick={() => setShowGuestInput(!showGuestInput)}>
                           Edit Tamu
                        </Button>
                        {showGuestInput && (
                           <>
                              <form onSubmit={handleSubmit(handleSaveGuestInfo)}>
                                 <Label>Nama Tamu</Label>
                                 <Input
                                    {...register('guestName', {
                                       required: 'Masukan Nama Tamu',
                                       minLength: { value: 3, message: 'Nama Tamu minimal 3 karakter' },
                                       maxLength: { value: 35, message: 'Nama Tamu maksimal 35 karakter' },
                                    })}
                                    placeholder="Nama Tamu"
                                    className="w-full p-2 border border-gray-300 rounded"
                                 />
                                 {errors.guestName && <p className="text-red-500 text-xs">{errors.guestName.message}</p>}

                                 <Label>Nomor HP</Label>
                                 <Input
                                    {...register('guestPhone', {
                                       required: 'Masukan Nomor HP',
                                       minLength: { value: 10, message: 'Nomor HP minimal 10 karakter' },
                                       maxLength: { value: 13, message: 'Nomor HP maksimal 13 karakter' },
                                    })}
                                    placeholder="Nomor HP"
                                    className="w-full p-2 border border-gray-300 rounded"
                                 />
                                 {errors.guestPhone && <p className="text-red-500 text-xs">{errors.guestPhone.message}</p>}

                                 <Button type="submit" variant={'secondary'} className="w-full mt-4">
                                    Simpan
                                 </Button>
                              </form>
                           </>
                        )}
                     </div>
                     <DialogFooter>
                        <Button onClick={() => updateBookingStatus(row.original.id, 'Check-In')} type="submit" className="bg-green-500 text-white">
                           <LuCalendarCheck className="w-5 h-5 mr-2" />
                           Check-In
                        </Button>
                        <Button onClick={() => updateBookingStatus(row.original.id, 'Check-Out')} type="submit" className="bg-yellow-500 text-white">
                           <RiCalendarCloseLine className="w-5 h-5 mr-2" />
                           Check-Out
                        </Button>
                        <Button onClick={() => updateBookingStatus(row.original.id, 'Cancel')} type="submit" className="bg-red-500 text-white">
                           <IoCloseCircleOutline className="w-5 h-5 mr-2" />
                           Cancel
                        </Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
               <Dialog>
                  <DialogTrigger asChild>
                     <Button variant="outline">
                        <FaMoneyBillWaveAlt className="w-5 h-5 mr-2" />
                        Pembayaran
                     </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] md:h-[500px]">
                     <DialogHeader>
                        <DialogTitle>Pembayaran</DialogTitle>
                     </DialogHeader>
                     <div className="grid gap-4 py-4">
                        <Image src={row.original.payment_proof_url} alt="Room Image" width={500} height={400} />
                        <Button className="bg-red-500 text-white" onClick={() => setShowReasonInput(!showReasonInput)}>
                           Alasan Penolakan
                        </Button>
                        {showReasonInput && (
                           <textarea
                              {...register('rejectionReason', {
                                 required: 'Masukan Alasan Penolakan',
                                 minLength: { value: 5, message: 'Alasan penolakan minimal 5 karakter' },
                                 maxLength: { value: 30, message: 'Alasan penolakan maksimal 30 karakter' },
                              })}
                              placeholder="Tuliskan alasan penolakan"
                              className="w-full p-2 border border-gray-300 rounded"
                           />
                        )}
                        {errors.rejectionReason && <p className="text-red-500 text-xs">{errors.rejectionReason.message}</p>}
                     </div>
                     <DialogFooter>
                        <Button onClick={() => updatePaymentStatus(row.original.id, 'Disetujui', 'sasa')} type="submit" className="bg-green-500 text-white">
                           <IoCheckmarkDoneCircleOutline />
                           <span className="ml-2">Setujui</span>
                        </Button>
                        <Button onClick={handleSubmit(handleReject)} type="submit" className="bg-red-500 text-white">
                           <TiDeleteOutline />
                           Tolak
                        </Button>
                     </DialogFooter>
                  </DialogContent>
               </Dialog>
               <Dialog>
                  <DialogTrigger asChild>
                     <Button onClick={() => setIsPreviewOpen(true)}>Invoice</Button>
                  </DialogTrigger>
                  <DialogContent className="w-full">
                     <DialogHeader>
                        <DialogTitle>Pembayaran</DialogTitle>
                     </DialogHeader>
                     <div className="grid gap-4 py-4">
                        <BlobProvider document={<MyDocument bookingData={row.original} />}>
                           {({ url, loading, error }) => {
                              if (loading) return <p>Loading...</p>;
                              if (error) return <p>Error loading PDF: {error.message}</p>;
                              return (
                                 <>
                                    <iframe src={url || ''} style={{ width: '100%', height: '500px' }} title="PDF Preview" />
                                 </>
                              );
                           }}
                        </BlobProvider>
                     </div>
                  </DialogContent>
               </Dialog>
               {/* <PDFDownloadLink document={<MyDocument bookingData={row.original} />} fileName={`booking-${row.original.id}.pdf`}>
                  {({ loading }) => (loading ? 'Preparing document...' : 'Download PDF')}
               </PDFDownloadLink> */}
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
