'use client';
import Image from 'next/image';

import NavbarHome from './NavbarHome';
import { Button } from '../ui/button';

export default function Hero() {
   return (
      <div className="relative w-screen h-screen flex  justify-center">
         <Image
            src="/assets/images/hero.jpeg" // Path relatif ke gambar
            alt="Deskripsi Gambar"
            layout="fill" // Membuat gambar memenuhi container
            objectFit="cover" // Mengatur agar gambar tetap proporsional
            className="opacity-50" // Mengatur opasitas gambar menjadi 50%
         />
         {/* Overlay transparan */}
         <div className="absolute inset-0 bg-black opacity-50"></div>
         {/* Navbar */}
         <div className="absolute w-full">
            <NavbarHome />
         </div>
         {/* Welcome Text */}
         <div className="absolute w-full mt-56 ">
            <div className=" text-white font-bold md:mx-52">
               <p className="text-5xl font-light">WELCOME TO</p>
               <p className="text-9xl font-medium">MAEROKOCO</p>
               <p className="text-6xl font-medium">
                  <span className="mr-2">H</span>
                  <span className="mr-2">O</span>
                  <span className="mr-2">T</span>
                  <span className="mr-2">E</span>
                  <span className="mr-2">L</span>
                  <span className="mr-2">S</span>
               </p>

               <p className="text-xl font-thin mt-10">
                  {' '}
                  Book your stay and enjoy <br />
                  redefined at the most affordable rates.
               </p>
            </div>
            <div className="absolute flex flex-col justify-center items-center w-full h-full">
               <Button className="bg-orange-500 border-none" variant={'secondary'}>
                  <span className="font-bold text-white"> BOOK NOW</span>
               </Button>
            </div>
         </div>
      </div>
   );
}
