import NavbarHome from '@/components/home/NavbarHome';
import ChangePassword from '@/components/user/ChangePassword';
import Profile from '@/components/user/Profile';
import React from 'react';

export default function page() {
   return (
      <div className="w-full">
         <div className=" bg-orange-500 h-16 w-full">
            <NavbarHome />
         </div>
         <ChangePassword />
      </div>
   );
}