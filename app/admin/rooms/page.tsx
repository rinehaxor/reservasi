import ReadRoom from '@/components/admin/readRoom';
import NavbarAdmin from '@/components/admin/navbarAdmin';
import React from 'react';

export default function page() {
   return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
         <div className="w-full">
            <NavbarAdmin />
            <ReadRoom />
         </div>
      </div>
   );
}
