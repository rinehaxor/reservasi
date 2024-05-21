'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import NavbarHome from '@/components/home/NavbarHome';
import Footer from '@/components/home/Footer';
import { Label } from '@/components/ui/label';

export default function ContactForm() {
   const [fullName, setFullName] = useState('');
   const [email, setEmail] = useState('');
   const [message, setMessage] = useState('');

   const handleSubmit = (e: any) => {
      e.preventDefault();
      const mailtoLink = `mailto:example@email.com?subject=Contact Form Submission&body=Name: ${fullName}%0D%0AEmail: ${email}%0D%0AMessage: ${message}`;
      window.location.href = mailtoLink;
   };

   return (
      <div className="w-full min-h-screen bg-gray-100">
         <NavbarHome />
         <div className="flex justify-center items-center min-h-screen px-4">
            <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md md:max-w-lg">
               <h2 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8 text-center text-orange-500">Kontak Kami</h2>
               <div className="mb-4 md:mb-6">
                  <Label htmlFor="fullName" className="block text-sm font-medium text-gray-800">
                     Nama Lengkap
                  </Label>
                  <Input
                     type="text"
                     id="fullName"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     className="mt-1 md:mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                     required
                  />
               </div>
               <div className="mb-4 md:mb-6">
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-800">
                     Email
                  </Label>
                  <Input
                     type="email"
                     id="email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="mt-1 md:mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                     required
                  />
               </div>
               <div className="mb-4 md:mb-6">
                  <Label htmlFor="message" className="block text-sm font-medium text-gray-800">
                     Pesan
                  </Label>
                  <Textarea
                     id="message"
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     className="mt-1 md:mt-2 block w-full border-gray-300 rounded-md shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
                     rows={4}
                     required
                  />
               </div>
               <div className="flex justify-end">
                  <Button variant={'secondary'} type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:bg-orange-600">
                     Submit
                  </Button>
               </div>
            </form>
         </div>
         <Footer />
      </div>
   );
}
