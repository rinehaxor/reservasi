'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client'; // Pastikan ini mengarah ke file yang benar!
import NavbarUserRegister from '@/components/user/NavbarUserRegister';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { WaveSVG } from '@/components/ui/waves';
import { redirect, useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormData {
   email: string;
   password: string;
}

const LoginForm = () => {
   const router = useRouter();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>();

   const [message, setMessage] = useState('');

   async function loginUser(data: FormData) {
      const { email, password } = data;
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
         email: email,
         password: password,
      });

      if (error) {
         toast.error('Email atau Password Salah');
         //  return redirect('/login?message=Could not authenticate user');
      }
      async function getUserRole(userId: any) {
         const supabase = createClient();
         const { data, error } = await supabase.from('user_roles').select(`role_id`).eq('user_id', userId).single();

         if (error) {
            toast.error('Login failed: ' + error.message);
            console.log('Error during login:', error.message);
            return;
         }

         return data.role_id; // asumsikan role_id 1 adalah 'user', 2 adalah 'admin'
      }
      const {
         data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
         //  toast.error('Login failed: User does not exist');
         console.log('User does not exist');
         return;
      }
      const roleId = await getUserRole(user?.id);
      const redirectPath = roleId !== 2 ? '/' : '/admin/dashboard';
      const successMessage = roleId !== 2 ? 'Login successful!' : 'Welcome admin, redirecting to dashboard...';

      toast.success(successMessage, {
         position: 'top-right',
         autoClose: 6000,
         onClose: () => router.push(redirectPath), // Redirect after toast closes
      });
   }

   const onSubmit = async (data: FormData) => {
      await loginUser(data);
   };

   return (
      <div className="w-full min-h-screen relative">
         <NavbarUserRegister />
         <div className="w-1/3 mx-auto max-w-sm items-center gap-1.5">
            <div className="mt-20">
               <h1 className="font-extrabold mb-10 text-lg md:text-2xl">Login Akun</h1>
               <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                     <Label htmlFor="email">Email</Label>
                     <Input type="email" id="email" {...register('email', { required: true })} placeholder="Email" className="form-input" />
                     {errors.email && <p className="text-red-500 text-xs md:text-lg">Masukan Email Anda.</p>}
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                     <Label htmlFor="password">Password</Label>
                     <Input type="password" id="password" {...register('password', { required: 'Password diperlukan.', minLength: { value: 8, message: 'Password harus minimal 8 karakter.' } })} className="form-input" />
                     {errors.password && <p className="text-red-500 text-xs md:text-lg">{errors.password.message}</p>}
                  </div>

                  <Button type="submit" variant={'secondary'} className="w-full mt-10">
                     Login
                  </Button>
                  <div className="mt-2">{message}</div>
                  {/* <div className="mt-2">
                     <Link href="/forgot-password">Lupa Password?</Link>
                  </div> */}
               </form>
            </div>
         </div>
         <WaveSVG />
      </div>
   );
};

export default LoginForm;
