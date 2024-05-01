import AddRoom from '@/components/admin/addRoom';
import ReadRoom from '@/components/admin/readRoom';
import NavbarAdmin from '@/components/admin/navbarAdmin';
import React from 'react';
import SideBar from '@/components/admin/SideBar';
import { WaveSVG } from '@/components/ui/waves';

export default function page() {
   return (
      <div className="w-full">
         <SideBar />
         <div className="flex-1 w-full flex flex-col gap-20 items-center mt-10">
            <div className="flex flex-row">
               <AddRoom />
               <WaveSVG />
            </div>
         </div>
      </div>
   );
}
