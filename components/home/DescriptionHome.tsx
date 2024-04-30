import React from 'react';

import Image from 'next/image';
import { Button } from '../ui/button';
export default function DescriptionHome() {
   return (
      <div className=" w-screen">
         <div className="flex flex-row  gap-10 mx-48 mt-20 ">
            <div className="w-1/2 flex  justify-center items-center">
               <div className="border-l-4  border-orange-500  ">
                  <p className="text-6xl font-bold ml-6  ">Suasana Alam</p>
                  <p className="text-3xl font-thin ml-6 mt-5">Hotel ini menawarkan suasana alam yang mempesona,ada ruangan dihiasi dengan hiasan alami yang menenangkan. </p>
               </div>
            </div>
            <div className="w-1/2 flex  justify-end items-center">
               {' '}
               <Image
                  src="/assets/images/deskripsi1.jpg" // Path relatif ke gambar
                  alt="Deskripsi Gambar"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full  h-full  "
               />
            </div>
         </div>
         <div className="flex flex-row  gap-10 mx-48 mt-20 ">
            <div className="w-1/2 flex  justify-center items-center">
               <div className="border-l-4  border-orange-500  ">
                  <p className="text-6xl font-bold ml-6  ">Wisata</p>
                  <p className="text-3xl font-thin ml-6 mt-5">Hotel Merdeka berada di lokasi strategis di pusat kota, hanya beberapa langkah dari berbagai atraksi populer, termasuk Makam Bung Karno yang bersejarah.. </p>
                  <Button className="bg-orange-500 border-none ml-6 mt-10 w-1/4" variant={'default'}>
                     <span className="font-bold text-white"> Jelajahi</span>
                  </Button>
               </div>
            </div>
            <div className="w-1/2 flex  justify-end items-center">
               {' '}
               <Image
                  src="/assets/images/deskripsi2.webp" // Path relatif ke gambar
                  alt="Deskripsi Gambar"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full  h-full  "
               />
            </div>
         </div>
         <div className="flex flex-col items-center justify-center my-20">
            <p className="text-6xl font-bold border-b-8 border-orange-500 ">ALAMAT</p>
            <p className="text-3xl mt-5">Jl. Dr. Moh. Hatta No.3</p>
            <p className="text-3xl mt-5"> Sentul, Kec. Kepanjenkidul, Kota Blitar </p>
            <p className="text-3xl mt-5">Jawa Timur </p>
         </div>
      </div>
   );
}
