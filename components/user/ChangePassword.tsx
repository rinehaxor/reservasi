'use client';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import SidebarUser from './SidebarUser';

export default function ChangePassword() {
   const supabase = createClient();
   const { register, handleSubmit, setError } = useForm();
   const [currentEmail, setCurrentEmail] = useState('');

   useEffect(() => {
      async function fetchUser() {
         const {
            data: { user },
            error,
         } = await supabase.auth.getUser();
         if (error) {
            console.error('Error fetching user:', error);
            return;
         }
         setCurrentEmail(user?.email || '');
      }
      fetchUser();
   }, [supabase]);

   const onSubmitPassword = async (data: any) => {
      const { currentPassword, newPassword } = data;

      // Re-authenticate the user with the current password
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
         email: currentEmail,
         password: currentPassword,
      });

      if (signInError) {
         setError('currentPassword', {
            type: 'manual',
            message: 'Current password is incorrect.',
         });
         return;
      }

      // Update the user's password
      const { error: passwordError } = await supabase.auth.updateUser({
         password: newPassword,
      });

      if (passwordError) {
         console.error('Error updating password:', passwordError);
         return;
      }

      alert('Password updated successfully!');
   };

   return (
      <>
         <div className="flex mx-[23rem] ">
            <SidebarUser />

            <div className="bg-white p-8 max-w-4xl my-10 border rounded shadow w-full">
               <div className="text-xl font-semibold mb-6 border-b pb-4">Ganti Password</div>
               <form onSubmit={handleSubmit(onSubmitPassword)}>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                     <div className="col-span-1">
                        <div className="font-medium">Password Saat Ini</div>
                     </div>
                     <div className="col-span-2">
                        <input type="password" {...register('currentPassword', { required: 'Current password is required' })} className="w-full p-2 border rounded" />
                     </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                     <div className="col-span-1">
                        <div className="font-medium">Password Baru</div>
                     </div>
                     <div className="col-span-2">
                        <input type="password" {...register('newPassword', { required: 'New password is required' })} className="w-full p-2 border rounded" />
                     </div>
                  </div>

                  <div className="flex justify-end">
                     <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                        Ganti Password
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </>
   );
}
