'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createClient } from '@/utils/supabase/client'; // Pastikan ini mengarah ke file yang benar!
import NavbarUserRegister from '@/components/user/NavbarUserRegister';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { WaveSVG } from '@/components/ui/waves';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface FormData {
   user: any;
   email: string;
   password: string;
   name: string;
   phone: string;
}

const RegisterForm = () => {
   const router = useRouter();
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>();
   const { shadtoast } = useToast();
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

   const [message, setMessage] = useState('');
   const [registrationSuccess, setRegistrationSuccess] = useState(false);

   async function registerUser(data: FormData) {
      const { email, password, name, phone } = data;
      const supabase = createClient();
      const { data: signUpData, error } = await supabase.auth.signUp({
         email,
         password,
         options: {
            data: { name, phone }, // Menyertakan data tambahan
         },
      });

      if (error) {
         console.error('Sign up error:', error.message);
         setMessage(`Error during sign up: ${error.message}`);
         return { error };
      }

      const user = signUpData.user;
      if (!user) {
         console.error('User object is undefined; likely awaiting email verification.');
         setMessage('User registration successful, please verify your email.');
         return { error: new Error('User is undefined;') };
      }

      const { data: role, error: roleFetchError } = await supabase.from('roles').select('id').eq('name', 'user').single();
      if (roleFetchError) {
         console.error('Failed to fetch role:', roleFetchError.message);
         return { error: roleFetchError };
      }

      if (role) {
         const { error: roleError } = await supabase.from('user_roles').insert({
            user_id: user.id,
            role_id: role.id,
         });

         if (roleError) {
            console.error('Failed to assign user role:', roleError.message);
            return { error: roleError };
         } else {
            console.log('Role assigned successfully');
         }
      }

      Cookies.set('user', JSON.stringify({ id: user?.id, role: role?.id, email: user?.email }));
      return signUpData ? { user: signUpData.user } : { error };
   }

   const onSubmit = async (data: FormData) => {
      const result = await registerUser(data);

      if (result.error) {
         console.error('Registration failed:', result.error.message);
         setMessage(`Registration failed: ${result.error.message}`);
         setRegistrationSuccess(false);
         if (result.error.message.toLowerCase().includes('already registered')) {
            toast.error('Akun sudah terdaftar. Silakan masuk atau gunakan email lain.');
         } else {
            toast.error('Pendaftaran akun gagal: ');
         }

         shadtoast({
            description: 'Your message has been sent.',
         });
      } else {
         console.log('Registration successful:', result.user);
         toast.success('Pendaftaran Akun Berhasil. ');
         setMessage('Registration successful!');
         setRegistrationSuccess(true);
      }
   };

   return (
      <div className="w-full min-h-screen relative">
         <NavbarUserRegister />

         <div className=" w-full md:w-1/3 mx-auto max-w-sm items-center gap-1.5">
            <div className="mt-20 md:mx-0 mx-10">
               <div className="mt-10">
                  {registrationSuccess && (
                     <Alert variant="primary">
                        <AlertTitle>Berhasil</AlertTitle>
                        <AlertDescription>
                           Pendaftaran Akun Berhasil.{' '}
                           <span className="font-bold">
                              <Link href="/login">Klik disini untuk Login</Link>
                           </span>
                        </AlertDescription>
                     </Alert>
                  )}
               </div>
               <h1 className="font-extrabold mb-10 text-lg md:text-2xl">Daftar Akun</h1>

               <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                     <Label htmlFor="name">Nama Lengkap</Label>
                     <Input
                        type="text"
                        id="name"
                        {...register('name', {
                           required: 'Masukan Nama Lengkap.',
                           minLength: {
                              value: 5,
                              message: 'Nama Lengkap harus minimal 5 karakter.',
                           },
                           maxLength: {
                              value: 35,
                              message: 'Nama Lengkap harus maksimal 35 karakter.',
                           },
                        })}
                        placeholder="Nama Lengkap"
                        className="form-input"
                     />
                     {errors.name && <p className="text-red-500 text-xs md:text-xs">{errors.name.message}</p>}
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                     <Label htmlFor="phone">Nomer HP</Label>
                     <Input
                        type="number"
                        id="phone"
                        {...register('phone', {
                           required: 'Masukan Nomer HP.',
                           minLength: {
                              value: 10,
                              message: 'Nomer HP harus minimal 10 karakter.',
                           },
                           maxLength: {
                              value: 13,
                              message: 'Nomer HP harus maksimal 13 karakter.',
                           },
                           pattern: {
                              value: /^[0-9]+$/,
                              message: 'Nomer HP harus berupa angka.',
                           },
                        })}
                        placeholder="Nomer HP"
                        className="form-input"
                     />
                     {errors.phone && <p className="text-red-500 text-xs md:text-xs">{errors.phone.message}</p>}
                  </div>

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
                     {errors.email && <p className="text-red-500 text-xs md:text-xs">{errors.email.message}</p>}
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
                     {errors.password && <p className="text-red-500 text-xs md:text-xs">{errors.password.message}</p>}
                  </div>
                  <div className="mt-5">
                     <p className="text-sm">
                        Sudah Punya Akun?{' '}
                        <span className="text-blue-500 font-semibold">
                           <Link href="/login">Masuk Sekarang</Link>{' '}
                        </span>
                     </p>
                  </div>
                  <Button type="submit" className="w-full mt-5">
                     Daftar
                  </Button>
                  {/* <div className="mt-2">{message}</div> */}
               </form>
               <ToastContainer />
            </div>
         </div>
         <WaveSVG />
      </div>
   );
};

export default RegisterForm;
