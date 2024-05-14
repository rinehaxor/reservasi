import NavbarHome from '@/components/home/NavbarHome';
import Reservasi from '@/components/user/Reservasi';

import React from 'react';

export default function page() {
   return (
      <div className="w-full">
         <div className=" bg-orange-500 h-16 w-full">
            <NavbarHome />
         </div>
         <Reservasi />
      </div>
   );
}
