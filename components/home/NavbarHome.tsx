'use client';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Button } from '../ui/button';
import { User } from '@supabase/auth-js';
import { usePathname, useRouter } from 'next/navigation';
import { GoChevronDown } from 'react-icons/go';
import Cookies from 'js-cookie';

// Initialize Supabase client
const supabase = createClient();

export default function NavbarHome({ faqRef }: { faqRef?: React.RefObject<HTMLDivElement> }) {
   const [isOpen, setIsOpen] = useState(false);
   const [user, setUser] = useState<User | null>(null);
   const [showLogout, setShowLogout] = useState(false);
   const router = useRouter();
   const pathname = usePathname();

   useEffect(() => {
      const fetchUser = async () => {
         const {
            data: { user },
         } = await supabase.auth.getUser();
         setUser(user);
      };

      fetchUser();
   }, []);

   const toggleMenu = () => {
      setIsOpen(!isOpen);
   };

   const handleLogout = async () => {
      Cookies.remove('user');

      setUser(null);
      await supabase.auth.signOut();
      router.push('/');
   };

   const scrollToFaq = () => {
      faqRef?.current?.scrollIntoView({ behavior: 'smooth' });
   };
   const toggleLogoutMenu = () => {
      setShowLogout(!showLogout);
   };

   return (
      <div className="w-full flex flex-col items-center text-white relative z-50">
         <nav className="w-full flex justify-center h-16 bg-orange-500 shadow-md">
            <div className="flex justify-between items-center w-full px-4 h-16 md:mx-48">
               <div className="flex items-center space-x-4 flex-grow">
                  <Link href="/" className="flex items-center py-5 px-2 text-white hover:text-gray-100 transition duration-200">
                     <span className="font-bold text-xl">MAEROKOCO</span>
                  </Link>
               </div>
               <div className="hidden md:flex items-center space-x-1">
                  <Link href="/" className="py-5 px-3 font-semibold text-white hover:text-gray-100 transition duration-200">
                     Home
                  </Link>
                  <Link href="/list-kamar" className="py-5 px-3 font-semibold text-white hover:text-gray-100 transition duration-200">
                     Room
                  </Link>
                  <Link href="/contact" className="py-5 px-3 font-semibold text-white hover:text-gray-100 transition duration-200">
                     Kontak
                  </Link>
                  {pathname === '/' && (
                     <button className="py-5 px-3 font-semibold text-white hover:text-gray-100 transition duration-200" onClick={scrollToFaq}>
                        Faq
                     </button>
                  )}
                  {user ? (
                     <div className="relative">
                        <button onClick={toggleLogoutMenu} className="py-2 px-4 rounded-md bg-orange-500 hover:bg-orange-500 text-white transition duration-200">
                           <div className="flex flex-row items-center">
                              {user?.email}
                              <span className="ml-2">
                                 <GoChevronDown />
                              </span>
                           </div>
                        </button>
                        {showLogout && (
                           <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50">
                              <ul className="py-1">
                                 <li>
                                    <Link href="/user/profile">
                                       <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Profile</button>
                                    </Link>
                                 </li>
                                 <li>
                                    <Link href="/user/edit-profile">
                                       <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Edit Profile</button>
                                    </Link>
                                 </li>
                                 <li>
                                    <Link href="/user/ganti-password">
                                       <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Ganti Password</button>
                                    </Link>
                                 </li>
                                 <li>
                                    <Link href="/user/reservasi">
                                       <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Reservasi</button>
                                    </Link>
                                 </li>
                                 <li>
                                    <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                       Keluar
                                    </button>
                                 </li>
                              </ul>
                           </div>
                        )}
                     </div>
                  ) : (
                     <Link href="/login" className="py-2 px-3 rounded-md bg-orange-700 hover:bg-orange-600 text-white transition duration-200">
                        Login
                     </Link>
                  )}
               </div>
               <div className="md:hidden flex items-center">
                  <button onClick={toggleMenu} className="z-50 text-white" aria-label="Toggle menu">
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                     </svg>
                  </button>
               </div>
            </div>
            <div className={`${isOpen ? 'block' : 'hidden'} absolute w-full bg-orange-500 z-40 md:hidden pt-3 transition duration-200`}>
               <Link href="/" className="block py-2 px-4 text-sm text-white hover:bg-orange-500 transition duration-200">
                  Home
               </Link>
               <Link href="/list-kamar" className="block py-2 px-4 text-sm text-white hover:bg-orange-500 transition duration-200">
                  Room
               </Link>
               <Link href="/contact" className="block py-2 px-4 text-sm text-white hover:bg-orange-500 transition duration-200">
                  Contact
               </Link>
               {pathname === '/' && (
                  <button className="block py-2 px-4 text-sm text-white hover:bg-orange-500 transition duration-200" onClick={scrollToFaq}>
                     Faq
                  </button>
               )}
               {user ? (
                  <div className="py-2 px-4 text-sm text-white">
                     <button onClick={toggleLogoutMenu}>
                        <div className="flex flex-row items-center">
                           {user?.email}

                           <span className="ml-2">
                              <GoChevronDown />
                           </span>
                        </div>
                     </button>
                     {showLogout && (
                        <div className="bg-white rounded-md shadow-xl mt-2">
                           <Link href="/user/profile">
                              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Profile</button>
                           </Link>
                           <Link href="/user/edit-profile">
                              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Edit Profile</button>
                           </Link>
                           <Link href="/user/ganti-password">
                              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Ganti Password</button>
                           </Link>
                           <Link href="/user/reservasi">
                              <button className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">Reservasi</button>
                           </Link>
                           <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                              Logout
                           </button>
                        </div>
                     )}
                  </div>
               ) : (
                  <Link href="/login" className="py-2 px-3 flex rounded-md bg-orange-700 hover:bg-orange-600 text-white transition duration-200">
                     Login
                  </Link>
               )}
            </div>
         </nav>
      </div>
   );
}
