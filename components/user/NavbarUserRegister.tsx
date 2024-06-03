import React from 'react';
import DeployButton from '../DeployButton';
import Image from 'next/image';

export default function NavbarUserRegister() {
   return (
      <>
         <div className="w-full flex  border-b border-b-foreground/10 h-16 bg-orange-500">
            <div className="w-full flex md:justify-start justify-center items-center p-3 text-sm md:mx-48 text-white">
               <Image
                  src="/assets/images/logo.png" // Path relative to the image
                  alt="logo"
                  width={70}
                  height={70}
                  className="w-50 h-50 mr-3" // Tambahkan margin kanan agar ada jarak antara logo dan teks
               />
               <span className="font-bold text-lg  ">Hotel Merokoco</span>
            </div>

            {/* <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
      
               </div> */}
         </div>
      </>
   );
}
