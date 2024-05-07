import AddFacility from '@/components/admin/AddFacility';
import AddPayment from '@/components/admin/AddPayment';
import SideBar from '@/components/admin/SideBar';
import { WaveSVG } from '@/components/ui/waves';
import React from 'react';

export default function page() {
   return (
      <div className="w-full">
         <SideBar />
         <div className="flex-1 w-full flex flex-col gap-20 items-center mt-10">
            <div className="flex flex-row">
               <AddPayment />
               <WaveSVG />
            </div>
         </div>
      </div>
   );
}
