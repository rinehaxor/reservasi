import { createClient } from '@/utils/supabase/client';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';
import { HiCollection, HiUserCircle } from 'react-icons/hi';
import { HiArrowRightOnRectangle, HiIdentification, HiLockClosed } from 'react-icons/hi2';

export default function SidebarUser() {
   const supabase = createClient();
   const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
         console.error('Logout Failed:', error.message);
      } else {
         Cookies.remove('user');
         console.log('Logged out successfully');
         redirect('/');
      }
   };
   return (
      <div className="p-4">
         <div className="bg-white p-4 border rounded shadow">
            <ul>
               <li className="mb-2 border-b-2">
                  <a href="/user/profile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                     <HiUserCircle className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                     <span className="ml-3 text-sm md:text-base">Personal details</span>
                  </a>
               </li>
               <li className="mb-2 border-b-2">
                  <Link href="/user/edit-profile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                     <HiIdentification className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                     <span className="ml-3 text-sm md:text-base">Edit Profile</span>
                  </Link>
               </li>
               <li className="mb-2 border-b-2">
                  <Link href="/user/reservasi" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                     <HiCollection className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                     <span className="ml-3 text-sm md:text-base">Reservasi</span>
                  </Link>
               </li>
               <li className="mb-2 border-b-2">
                  <Link href="/user/ganti-password" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                     <HiLockClosed className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                     <span className="ml-3 text-sm md:text-base">Ganti Password</span>
                  </Link>
               </li>
               <li>
                  <Link href="/login" onClick={handleLogout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                     <HiArrowRightOnRectangle className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                     <span className="flex-1 ml-3 text-sm md:text-base whitespace-nowrap">Keluar</span>
                  </Link>
               </li>
            </ul>
         </div>
      </div>
   );
}
