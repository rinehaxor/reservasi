import NavbarHome from '@/components/home/NavbarHome';
import React from 'react';

export default function page() {
   return (
      <div className="w-full">
         <div className=" bg-orange-500 h-16 w-full">
            <NavbarHome />
         </div>
         <div className="">List Kamar</div>
      </div>
   );
}
