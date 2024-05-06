import Footer from '@/components/home/Footer';
import ListRooms from '@/components/home/ListRooms';
import NavbarHome from '@/components/home/NavbarHome';
import React from 'react';

export default function page() {
   return (
      <div className="w-full">
         <div className=" bg-orange-500 h-16 w-full">
            <NavbarHome />
         </div>
         <div className="">
            <ListRooms />
            <Footer />
         </div>
      </div>
   );
}
