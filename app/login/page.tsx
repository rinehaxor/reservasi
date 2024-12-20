'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client'; // Pastikan ini mengarah ke file yang benar!
import NavbarUserRegister from '@/components/user/NavbarUserRegister';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { WaveSVG } from '@/components/ui/waves';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import Cookies from 'js-cookie';

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
   const supabase = createClient();

   useEffect(() => {
      async function checkUser() {
         const {
            data: { user },
         } = await supabase.auth.getUser();

         if (user) {
            // If the user is logged in, redirect them away from the login page
            router.push('/');
         }
      }

      checkUser();
   }, [supabase, router]);

   async function loginUser(data: FormData) {
      const { email, password } = data;
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
         email: email,
         password: password,
      });

      if (error) {
         toast.error('Email atau Password Salah');
         return;
      }

      async function getUserRole(userId: any) {
         const supabase = createClient();
         const { data, error } = await supabase.from('user_roles').select('role_id').eq('user_id', userId).single();

         if (error) {
            toast.error('Login failed: ' + error.message);
            console.log('Error during login:', error.message);
            return;
         }

         return data.role_id; // role_id 1 adalah 'user', 2 adalah 'admin'
      }

      const {
         data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
         console.log('User does not exist');
         return;
      }

      const roleId = await getUserRole(user.id);
      Cookies.set('user', JSON.stringify({ id: user.id, role: roleId, email: user.email }));

      if (roleId !== 2) {
         toast.success('Login berhasil!', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'light',
         });
         // Redirect user biasa ke homepage atau halaman lain
         setTimeout(() => {
            router.push('/');
         }, 3000);
      } else {
         toast.success('Welcome admin');
         setTimeout(() => {
            router.push('/admin/dashboard');
         }, 3000);
      }
   }

   const onSubmit = async (data: FormData) => {
      await loginUser(data);
   };

   return (
      <div className="w-full min-h-screen relative">
         <NavbarUserRegister />
         <div className="w-full md:w-1/3 mx-auto max-w-sm items-center gap-1.5">
            <div className="mt-20 md:mx-0 mx-10">
               <h1 className="font-extrabold mb-10 text-lg md:text-2xl">Login Akun</h1>
               <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                     <Label htmlFor="email">Email</Label>
                     <Input
                        type="email"
                        id="email"
                        {...register('email', {
                           required: 'Masukan Email.',
                           minLength: {
                              value: 8,
                              message: 'Email harus minimal 8 karakter.',
                           },
                           maxLength: {
                              value: 30,
                              message: 'Email harus maksimal 30 karakter.',
                           },
                           pattern: {
                              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                              message: 'Email tidak valid.',
                           },
                        })}
                        placeholder="Email"
                        className="form-input"
                     />
                     {errors.email && <p className="text-red-500 text-xs font-bold md:text-xs">{errors.email.message}</p>}
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        type="password"
                        placeholder="*******"
                        id="password"
                        {...register('password', {
                           required: 'Masukan Password .',
                           minLength: {
                              value: 8,
                              message: 'Password harus minimal 8 karakter.',
                           },
                           maxLength: {
                              value: 30,
                              message: 'Password harus maksimal 30 karakter.',
                           },
                        })}
                        className="form-input"
                     />
                     {errors.password && <p className="text-red-500 text-xs font-bold md:text-xs">{errors.password.message}</p>}
                  </div>

                  <div className="mt-5">
                     <p className="text-sm">
                        Tidak Punya Akun?{' '}
                        <span className="text-blue-500  font-semibold">
                           <Link href="/register">Daftar Sekarang</Link>{' '}
                        </span>
                     </p>
                  </div>
                  <Button type="submit" className="w-full mt-10">
                     Login
                  </Button>
                  <div className="mt-2">{message}</div>
               </form>
            </div>
            <ToastContainer />
         </div>
         <WaveSVG />
      </div>
   );
};

export default LoginForm;
