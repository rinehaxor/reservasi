'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SidebarUser from './SidebarUser';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '@/hooks/useAuth';
import Swal from 'sweetalert2';

export default function ChangePassword() {
   const supabase = createClient();
   const {
      register,
      handleSubmit,
      setError,
      formState: { errors },
   } = useForm();
   const [currentEmail, setCurrentEmail] = useState<string>('');
   const [sessionData, setSessionData] = useState<{ access_token: string; refresh_token: string } | null>(null);

   useEffect(() => {
      async function fetchUser() {
         const { data, error } = await supabase.auth.getUser();
         if (error) {
            console.error('Error fetching user:', error);
            return;
         }
         if (data.user) {
            const email = data.user.email;
            if (email) {
               setCurrentEmail(email);
            }
            const sessionResponse = await supabase.auth.getSession();
            if (sessionResponse.error) {
               console.error('Error fetching session:', sessionResponse.error);
               return;
            }
            const session = sessionResponse.data.session;
            if (session) {
               setSessionData({
                  access_token: session.access_token,
                  refresh_token: session.refresh_token,
               });
            }
         }
      }
      fetchUser();
   }, [supabase]);

   const onSubmitPassword = async (data: any) => {
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

      if (!result.isConfirmed) {
         return;
      }

      const { currentPassword, newPassword } = data;

      const currentSessionData = sessionData;

      // Autentikasi ulang dengan kata sandi saat ini
      const { error: signInError } = await supabase.auth.signInWithPassword({
         email: currentEmail,
         password: currentPassword,
      });

      if (signInError) {
         // Pulihkan session data jika autentikasi ulang gagal
         if (currentSessionData) {
            await supabase.auth.setSession({
               access_token: currentSessionData.access_token,
               refresh_token: currentSessionData.refresh_token,
            });
         }

         toast.error('Gagal Mengganti Password. Pastikan Password Saat Ini Benar.');
         setError('currentPassword', {
            type: 'manual',
            message: 'Current password is incorrect.',
         });
         return;
      }

      // Memperbarui kata sandi pengguna
      const { error: passwordError } = await supabase.auth.updateUser({
         password: newPassword,
      });

      if (passwordError) {
         console.error('Error updating password:', passwordError);
         toast.error('Gagal Mengganti Password. Pastikan Password Baru Valid.');
         return;
      }

      // Autentikasi ulang dengan kata sandi baru untuk mendapatkan sesi baru
      const { data: newSession, error: reAuthError } = await supabase.auth.signInWithPassword({
         email: currentEmail,
         password: newPassword,
      });

      if (reAuthError) {
         console.error('Error re-authenticating with new password:', reAuthError);
         toast.error('Berhasil Mengganti Password, tetapi gagal memperbarui sesi. Silakan masuk kembali.');
         return;
      }

      // Set session baru menggunakan sesi yang diperoleh setelah autentikasi ulang
      setSessionData({
         access_token: newSession.session.access_token,
         refresh_token: newSession.session.refresh_token,
      });

      toast.success('Berhasil Mengganti Password dan memperbarui sesi.');
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
                  <div className="text-xl font-semibold mb-6 border-b pb-4">Ganti Password</div>
                  <form onSubmit={handleSubmit(onSubmitPassword)}>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-1">
                           <Label className="font-medium text-lg">Password Saat Ini</Label>
                        </div>
                        <div className="md:col-span-2">
                           <Input
                              type="password"
                              {...register('currentPassword', {
                                 required: 'Masukan Password',
                                 minLength: {
                                    value: 8,
                                    message: 'Password Saat Ini minimal 8 karakter',
                                 },
                                 maxLength: {
                                    value: 25,
                                    message: 'Password Saat Ini tidak boleh lebih dari 25 karakter',
                                 },
                              })}
                              className="w-full p-2 border rounded"
                           />
                           {errors.currentPassword?.message && <p className="text-red-500 text-xs">{String(errors.currentPassword.message)}</p>}
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="md:col-span-1">
                           <Label className="font-medium text-lg">Password Baru</Label>
                        </div>
                        <div className="md:col-span-2">
                           <Input
                              type="password"
                              {...register('newPassword', {
                                 required: 'Masukan Password',
                                 minLength: {
                                    value: 8,
                                    message: 'Password Saat Ini minimal 8 karakter',
                                 },
                                 maxLength: {
                                    value: 25,
                                    message: 'Password Saat Ini tidak boleh lebih dari 25 karakter',
                                 },
                              })}
                              className="w-full p-2 border rounded"
                           />
                           {errors.newPassword?.message && <p className="text-red-500 text-xs">{String(errors.newPassword.message)}</p>}
                        </div>
                     </div>

                     <div className="flex justify-end">
                        <Button type="submit" variant={'secondary'}>
                           Ganti Password
                        </Button>
                     </div>
                  </form>
               </div>
            </div>
         </div>
         <ToastContainer />
      </div>
   );
}
