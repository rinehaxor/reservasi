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
                  <p className="text-3xl font-thin ml-6 mt-5">Hotel Maerokoco berada di lokasi strategis di pusat kota, hanya beberapa langkah dari berbagai atraksi populer, termasuk Makam Bung Karno yang bersejarah.. </p>
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
            <p className="text-6xl font-bold border-b-8 border-orange-500 mb-5 ">ALAMAT</p>
            <iframe
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.1138152166154!2d112.17037407632269!3d-8.089874380898156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78ec69f8d762b5%3A0xaa78c75b15c57c6a!2sHotel%20Maerokoco!5e0!3m2!1sid!2sid!4v1714650014215!5m2!1sid!2sid"
               width="900"
               height="650"
               style={{ border: '0' }} // Perubahan di sini
               allowFullScreen={true}
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
         </div>
      </div>
   );
}
