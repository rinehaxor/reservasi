'use client';
import Image from 'next/image';
import NavbarHome from './NavbarHome';
import { Button } from '../ui/button';
import { LuBackpack } from 'react-icons/lu';
import Link from 'next/link';

export default function Hero() {
   return (
      <div className="relative w-screen h-screen flex justify-center">
         <Image
            src="/assets/images/hero.jpeg" // Path relative to the image
            alt="Deskripsi Gambar"
            layout="fill" // Make the image fill the container
            objectFit="cover" // Keep the image proportional
            className="opacity-50" // Set image opacity to 50%
         />
         {/* Transparent Overlay */}
         <div className="absolute inset-0 bg-black opacity-50"></div>
         {/* Navbar */}
         <div className="absolute w-full">
            <NavbarHome />
         </div>
         {/* Welcome Text */}
         <div className="absolute w-full mt-56 md:mt-24">
            <div className="text-white font-bold px-4 md:mx-52">
               <p className="text-3xl md:text-5xl font-light">WELCOME TO</p>
               <p className="text-5xl md:text-9xl font-medium">MAEROKOCO</p>
               <p className="text-3xl md:text-6xl font-medium">
                  <span className="mr-2">H</span>
                  <span className="mr-2">O</span>
                  <span className="mr-2">T</span>
                  <span className="mr-2">E</span>
                  <span className="mr-2">L</span>
                  <span className="mr-2">S</span>
               </p>
               <p className="text-sm md:text-xl font-thin mt-7">
                  {/* Pesan penginapan Anda dan nikmatilah <br />
                  Senang dengan harga paling terjangkau. */}
                  Pesan penginapan anda sekarang, <br />
                  dan nikmati suasana nyaman dengan harga paling terjangkau
               </p>
            </div>
            <div className="absolute flex flex-col justify-center items-center w-full h-full mb-5">
               <Link href={'/list-kamar'}>
                  {' '}
                  <Button className="bg-orange-500 border-none flex gap-3 text-sm md:text-base" variant={'secondary'}>
                     <LuBackpack /> BOOK NOW
                  </Button>
               </Link>
            </div>
         </div>
      </div>
   );
}
