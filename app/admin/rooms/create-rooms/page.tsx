import AddRoom from '@/components/admin/addRoom';
import ReadRoom from '@/components/admin/readRoom';
import NavbarAdmin from '@/components/admin/navbarAdmin';
import React from 'react';
import SideBar from '@/components/admin/SideBar';
import { WaveSVG } from '@/components/ui/waves';

export default function page() {
   return (
      <div className="w-full">
         <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <NavbarAdmin />
            <div className="flex flex-row">
               <SideBar />
               <AddRoom />
               <WaveSVG />
            </div>
         </div>
      </div>
   );
}
