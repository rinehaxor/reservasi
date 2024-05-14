import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import React from 'react';
import { HiUserCircle } from 'react-icons/hi';
import { HiIdentification } from 'react-icons/hi2';
import { HiLockClosed } from 'react-icons/hi2';
import { HiMiniArrowRightStartOnRectangle } from 'react-icons/hi2';

export default function SidebarUser() {
   const supabase = createClient();
   const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
         console.error('Logout Failed:', error.message);
      } else {
         console.log('Logged out successfully');
         // Redirect user or handle user state change
      }
   };
   return (
      <div className="p-4  my-6 w-1/5">
         <div className="bg-white p-4 border rounded shadow">
            <ul>
               <li className="mb-2 border-b-2">
                  <a href="/user/profile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                     <svg
                        className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 18"
                     >
                        <HiUserCircle />
                     </svg>
                     Personal details
                  </a>
               </li>
               <li className="mb-2 border-b-2">
                  <Link href="/user/edit-profile" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                     <svg
                        className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 18"
                     >
                        <HiIdentification />
                     </svg>
                     Edit Profile
                  </Link>
               </li>
               <li className="mb-2 border-b-2">
                  <Link href="user/ganti-password" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                     <svg
                        className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 18"
                     >
                        <HiLockClosed />
                     </svg>
                     Ganti Password
                  </Link>
               </li>

               <li>
                  <Link href="/login" onClick={handleLogout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                     <svg
                        className="flex-shrink-0 w-8 h-8 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 18"
                     >
                        {' '}
                        <HiMiniArrowRightStartOnRectangle />
                     </svg>
                     <span className="flex-1 ms-3 whitespace-nowrap">Keluar</span>
                  </Link>
               </li>
            </ul>
         </div>
      </div>
   );
}
