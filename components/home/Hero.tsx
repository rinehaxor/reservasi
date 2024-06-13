'use client';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { Button } from '../ui/button';
import { LuBackpack } from 'react-icons/lu';
import Link from 'next/link';

const NavbarHome = dynamic(() => import('./NavbarHome'), { ssr: false });

export default function Hero({ faqRef, contactRef }: { faqRef: React.RefObject<HTMLDivElement>; contactRef: React.RefObject<HTMLDivElement> }) {
   return (
      <div className="relative w-screen h-screen flex justify-center">
         <Image src="/assets/images/hero.jpeg" alt="Deskripsi Gambar" layout="fill" objectFit="cover" className="opacity-50" priority={true} />
         <div className="absolute inset-0 bg-black opacity-50"></div>
         <div className="absolute w-full">
            <NavbarHome faqRef={faqRef} contactRef={contactRef} />
         </div>
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
                  Pesan penginapan anda sekarang, <br />
                  dan nikmati suasana nyaman dengan harga paling terjangkau
               </p>
            </div>
            <div className="absolute flex flex-col justify-center items-center w-full h-full mb-5">
               <Link href={'/list-kamar'}>
                  <Button className="bg-orange-500 border-none flex gap-3 text-sm md:text-base" variant={'secondary'}>
                     <LuBackpack /> BOOK NOW
                  </Button>
               </Link>
            </div>
         </div>
      </div>
   );
}
