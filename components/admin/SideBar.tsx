'use client';
import React, { useEffect, useRef, useState } from 'react';
import { HiInboxArrowDown } from 'react-icons/hi2';
import Link from 'next/link';
import { ImHome2 } from 'react-icons/im';
import { ImList } from 'react-icons/im';
import { createClient } from '@/utils/supabase/client';
import { HiFolderOpen } from 'react-icons/hi2';
import { HiCurrencyDollar } from 'react-icons/hi';
import { redirect } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';

export default function SideBar() {
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
   const sidebarRef = useRef<HTMLDivElement>(null);

   const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
   };

   const handleOutsideClick = (event: any) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as HTMLElement)) {
         setIsSidebarOpen(false);
      }
   };

   useEffect(() => {
      document.addEventListener('mousedown', handleOutsideClick);

      return () => {
         document.removeEventListener('mousedown', handleOutsideClick);
      };
   }, []);
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
      <div className="flex flex-col">
         <div>
            <button
               onClick={toggleSidebar}
               aria-controls="default-sidebar"
               type="button"
               className="inline-flex p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            >
               <span className="sr-only">Open sidebar</span>
               <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                     clipRule="evenodd"
                     fillRule="evenodd"
                     d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
               </svg>
            </button>

            <aside ref={sidebarRef} id="default-sidebar" className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${isSidebarOpen ? '' : '-translate-x-full sm:translate-x-0'}`} aria-label="Sidebar">
               <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
                  <div className="text-center text-xl font-bold font-poppins my-5 flex flex-row items-center justify-center">
                     <Image
                        src="/assets/images/logo.png" // Path relative to the image
                        alt="logo"
                        width={50}
                        height={50}
                        className="w-50 h-50 mr-3" // Tambahkan margin kanan agar ada jarak antara logo dan teks
                     />
                     <span>MAEROKOCO</span>
                  </div>

                  <ul className="space-y-2 font-medium">
                     <li>
                        <Link href="/admin/dashboard" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                           <svg
                              className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 22 21"
                           >
                              <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                              <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                           </svg>
                           <span className="ms-3">Dashboard</span>
                        </Link>
                     </li>
                     <li>
                        <a href="/admin/rooms" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                           <ImHome2 className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                           <span className="flex-1 ms-3 whitespace-nowrap">Kamar</span>
                        </a>
                     </li>
                     <li>
                        <Link href="/admin/reservasi" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                           <svg
                              className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                           >
                              <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 0 1 0-2h2a1 1 0 0 1 0 2Z" />
                           </svg>
                           <span className="flex-1 ms-3 whitespace-nowrap">Reservasi</span>
                        </Link>
                     </li>
                     <li>
                        <Link href="/admin/reservasi-selesai" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                           <HiInboxArrowDown className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                           <span className="flex-1 ms-3 whitespace-nowrap">Riwayat Reservasi</span>
                        </Link>
                     </li>
                     <li>
                        <Link href="/admin/ketersediaan-room" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                           <HiFolderOpen className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                           <span className="flex-1 ms-3 whitespace-nowrap">Ketersediaan Kamar</span>
                        </Link>
                     </li>
                     <li>
                        <a href="/admin/fasilitas" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                           <ImList className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                           <span className="flex-1 ms-3 whitespace-nowrap">Fasilitas</span>
                        </a>
                     </li>
                     <li>
                        <a href="/admin/payment" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                           <HiCurrencyDollar className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                           <span className="flex-1 ms-3 whitespace-nowrap">Pembayaran</span>
                        </a>
                     </li>
                     <li>
                        <Link href="/login" onClick={handleLogout} className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                           <svg
                              className="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 18 16"
                           >
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M1 8h11m0 0L8 4m4 4-4 4m4-11h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-3" />
                           </svg>
                           <span className="flex-1 ms-3 whitespace-nowrap">Keluar</span>
                        </Link>
                     </li>
                  </ul>
               </div>
            </aside>
            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black opacity-50 z-30"></div>}
         </div>
      </div>
   );
}
