'use client';
import { useState } from 'react';
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

interface FormData {
   user: any;
   email: string;
   password: string;
   name: string;
   phone: string;
}
const RegisterForm = () => {
   const {
      register,
      handleSubmit,
      formState: { errors },
   } = useForm<FormData>();
   const { toast } = useToast();

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

      // Logic sama, tapi tambahkan handle untuk nama dan telepon
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

      return signUpData ? { user: signUpData.user } : { error };
   }

   const onSubmit = async (data: FormData) => {
      const result = await registerUser(data);

      if (result.error) {
         // Handle error
         console.error('Registration failed:', result.error.message);
         setMessage(`Registration failed: ${result.error.message}`);
         setRegistrationSuccess(false); // Make sure to reset success state in case of error
         // Additional error handling like showing an error toast or alert can go here
         toast({
            description: 'Your message has been sent.',
         });
      } else {
         // Handle success
         console.log('Registration successful:', result.user);
         setMessage('Registration successful!'); // You can use this message or replace it with the Alert component
         setRegistrationSuccess(true); // Set the success state to true
         // Here you could redirect the user to another page or clear the form fields if necessary
         // For example:
         // history.push('/dashboard'); // If you're using React Router
      }
   };

   return (
      <div className="w-full min-h-screen relative">
         <NavbarUserRegister />

         <div className="w-1/3 mx-auto max-w-sm items-center gap-1.5 ">
            <div className="mt-20">
               <div className="mt-10">
                  {registrationSuccess && (
                     <Alert variant="primary">
                        <AlertTitle>Berhasi</AlertTitle>
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
                     <Label htmlFor="name">Nama</Label>
                     <Input type="text" id="name" {...register('name', { required: true })} placeholder="Nama Lengkap" className="form-input" />
                     {errors.name && <p className="text-red-500 text-xs md:text-lg">Masukan Nama Anda.</p>}
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                     <Label htmlFor="phone">Nomer HP</Label>
                     <Input type="tel" id="phone" {...register('phone', { required: true })} placeholder="Nomer HP" className="form-input" />
                     {errors.name && <p className="text-red-500 text-xs md:text-lg">Masukan Nomer HP Anda.</p>}
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                     <Label htmlFor="email">Email</Label>
                     <Input type="email" id="email" {...register('email', { required: true })} placeholder="Email" className="form-input" />
                     {errors.email && <p className="text-red-500 text-xs md:text-lg">Masukan Email Anda .</p>}
                  </div>

                  <div className="grid w-full max-w-sm items-center gap-1.5 mb-2">
                     <Label htmlFor="password">Password</Label>
                     <Input
                        type="password"
                        id="password"
                        placeholder="*******"
                        {...register('password', { required: 'Password diperlukan.', minLength: { value: 8, message: 'Password harus minimal 8 karakter.' } })}
                        className="form-input"
                     />
                     {errors.password && <p className="text-red-500 text-xs md:text-lg">{errors.password.message}</p>}
                  </div>

                  <Button type="submit" className="w-full mt-5" variant={'secondary'}>
                     Daftar
                  </Button>
                  <div className="mt-2">{message}</div>
               </form>
            </div>
         </div>
         <WaveSVG />
      </div>
   );
};

export default RegisterForm;
