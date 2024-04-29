import Image from 'next/image';
import React from 'react';

export default function Hero() {
   return (
      <div className="relative w-screen h-screen flex ">
         {/* Image sebagai background */}
         <Image
            src="/assets/images/hero.jpeg" // Path relatif ke gambar
            alt="Deskripsi Gambar"
            layout="fill" // Membuat gambar memenuhi container
            // objectFit="cover" // Mengatur agar gambar tetap proporsional
            className="opacity-50" // Mengatur opasitas gambar menjadi 50%
         />

         {/* Overlay transparan */}
         <div className="absolute inset-0 bg-black opacity-25"></div>

         {/* navbar */}
         <div className="flex items-  justify-between">
            <div className="absolute z-10 text-white text-center">
               <div className="mb-8 text-4xl font-bold">Logo</div>
               <div className="flex flex-row">
                  <p>p</p>
                  <p>p</p>
                  <p>p</p>
                  <p>p</p>
               </div>
            </div>
         </div>
      </div>
   );
}
