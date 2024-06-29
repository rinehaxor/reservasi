'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SidebarUser from './SidebarUser';
import { User } from '@supabase/supabase-js';
import Spinner from '../ui/spinner';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '@/hooks/useAuth';
import Swal from 'sweetalert2';

export default function EditProfile() {
   const supabase = createClient();
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);

   async function fetchUser() {
      const {
         data: { user },
         error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
         console.error('Error fetching user:', userError);
         setLoading(false);
         return;
      }

      setUser(user);
      setLoading(false);
      reset({
         name: user?.user_metadata?.name,
         email: user?.email,
         phone: user?.user_metadata?.phone,
      });
   }

   useEffect(() => {
      fetchUser(); // Memanggil fungsi fetchUser ketika komponen dimuat
   }, []); // Dependensi kosong agar useEffect hanya berjalan sekali saat komponen mount

   const onSubmit = async (data: any) => {
      const result = await Swal.fire({
         title: 'Apakah Anda yakin?',
         text: 'Pastikan data yang diubah sudah benar.',
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Ya, perbarui!',
         cancelButtonText: 'Batal',
      });

      if (result.isConfirmed) {
         const { name, email, phone } = data;

         // Update user metadata
         const { error: metadataError } = await supabase.auth.updateUser({
            data: { name, phone },
         });

         if (metadataError) {
            console.error('Error updating user metadata:', metadataError);
            toast.error('Gagal mengedit metadata user.');
            return;
         }

         // Update email
         const { error: emailError } = await supabase.auth.updateUser({
            email: email,
         });

         if (emailError) {
            console.error('Error updating email:', emailError);
            toast.error('Gagal mengedit email.');
            return;
         }

         fetchUser(); // Refresh user data after update
         toast.success('Berhasil mengedit profil.');
      }
   };
   useAuth();

   return (
      <div>
         <div className="flex flex-col md:flex-row items-start p-4 md:p-8 md:mx-48">
            <div className="hidden md:block md:w-1/4">
               <SidebarUser />
            </div>
            <div className="w-full md:w-3/4 p-4">
               <div className="bg-white p-6 border rounded shadow-md">
                  {loading ? (
                     <Spinner /> // Display the spinner while loading
                  ) : (
                     <>
                        <div className="text-xl font-semibold mb-6 border-b pb-4">Edit Data Pribadi</div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="md:col-span-1">
                                 <div className="font-medium">
                                    <Label>Nama</Label>
                                 </div>
                              </div>
                              <div className="md:col-span-2">
                                 <input
                                    type="text"
                                    {...register('name', {
                                       required: 'Masukan Nama ',
                                       minLength: {
                                          value: 3,
                                          message: 'Nama minimal 3 karakter',
                                       },
                                       maxLength: {
                                          value: 35,
                                          message: 'Nama tidak boleh lebih dari 35 karakter',
                                       },
                                    })}
                                    className="w-full p-2 border rounded"
                                 />
                                 {errors.name?.message && <p className="text-red-500 text-xs">{String(errors.name.message)}</p>}
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="md:col-span-1">
                                 <div className="font-medium">
                                    <Label>Alamat Email</Label>
                                 </div>
                              </div>
                              <div className="md:col-span-2">
                                 <Input
                                    type="email"
                                    {...register('email', {
                                       required: 'Masukan Alamat Email ',
                                       minLength: {
                                          value: 12,
                                          message: 'Alamat email minimal 12 karakter',
                                       },
                                       maxLength: {
                                          value: 50,
                                          message: 'Alamat email tidak boleh lebih dari 50 karakter',
                                       },
                                       pattern: {
                                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                          message: 'Alamat email tidak valid',
                                       },
                                    })}
                                    className="w-full p-2 border rounded"
                                 />

                                 {errors.email?.message && <p className="text-red-500 text-xs">{String(errors.email.message)}</p>}
                                 <div className="text-sm text-gray-500 mt-1">Ini email yang Anda gunakan untuk login akun dan melakukan pemesanan kamar.</div>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                              <div className="md:col-span-1">
                                 <div className="font-medium">
                                    <Label>Nomor Telepon</Label>
                                 </div>
                              </div>
                              <div className="md:col-span-2">
                                 <Input
                                    type="text"
                                    {...register('phone', {
                                       required: 'Masukan Nomor Telepon ',
                                       minLength: {
                                          value: 9,
                                          message: 'Nomor telepon minimal 9 karakter',
                                       },
                                       maxLength: {
                                          value: 14,
                                          message: 'Nomor telepon tidak boleh lebih dari 14 karakter',
                                       },
                                    })}
                                    className="w-full p-2 border rounded"
                                 />

                                 {errors.phone?.message && <p className="text-red-500 text-xs">{String(errors.phone.message)}</p>}
                              </div>
                           </div>

                           <div className="flex justify-end">
                              <Button type="submit" variant={'secondary'}>
                                 Simpan
                              </Button>
                           </div>
                        </form>
                     </>
                  )}
               </div>
            </div>
         </div>
         <ToastContainer />
      </div>
   );
}
