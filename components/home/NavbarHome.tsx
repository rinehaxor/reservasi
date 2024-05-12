'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Button } from '../ui/button';
import { User } from '@supabase/auth-js';
import { useRouter } from 'next/navigation';

// Initialize Supabase client
const supabase = createClient();

export default function NavbarHome() {
   const [isOpen, setIsOpen] = useState(false);
   const [user, setUser] = useState<User | null>(null);
   const [showLogout, setShowLogout] = useState(false);
   const router = useRouter();

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
      setUser(null);
      await supabase.auth.signOut();
      router.push('/');
   };

   const toggleLogoutMenu = () => {
      setShowLogout(!showLogout);
   };

   const toggleLogout = () => {
      setShowLogout(!showLogout);
   };

   return (
      <>
         <div className="w-full flex flex-col items-center text-white relative" style={{ zIndex: 50 }}>
            <nav className="w-full flex justify-center h-16">
               <div className="flex justify-between items-center w-full px-4 h-16 md:mx-48">
                  <div className="flex items-center space-x-4 flex-grow">
                     <a href="#" className="flex items-center py-5 px-2 text-gray-200 hover:text-gray-100">
                        <span className="font-bold">MAEROKOCO</span>
                     </a>
                  </div>
                  <div className="hidden md:flex items-center space-x-1">
                     {/* Navigation Links */}
                     <a href="#" className="py-5 px-3 hover:text-gray-100">
                        Home
                     </a>
                     <a href="#" className="py-5 px-3 hover:text-gray-100">
                        About
                     </a>
                     <a href="#" className="py-5 px-3 hover:text-gray-100">
                        Room
                     </a>
                     <a href="#" className="py-5 px-3 hover:text-gray-100">
                        Contact
                     </a>
                     {user ? (
                        <div className="relative">
                           <button onClick={toggleLogoutMenu} className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                              {user?.email}
                           </button>
                           {showLogout && (
                              <div className="absolute right-0 mt-2 w-48  rounded-md shadow-xl z-50">
                                 <ul>
                                    <li>
                                       <Button onClick={handleLogout} className="block px-4 py-2 text-sm  w-full text-left" variant={'secondary'}>
                                          Logout
                                       </Button>
                                    </li>
                                 </ul>
                              </div>
                           )}
                        </div>
                     ) : (
                        <Link href="/login" className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
                           Login
                        </Link>
                     )}
                  </div>
                  <div className="md:hidden flex items-center">
                     <button onClick={toggleMenu} className="z-50">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                     </button>
                  </div>
               </div>
               {/* Mobile Menu */}
               <div className={`${isOpen ? 'block' : 'hidden'} absolute  w-full bg-orange-500 z-40 md:hidden pt-3`}>
                  <a href="#" className="block py-2 px-4 text-sm  border-white border-bold">
                     Home
                  </a>
                  <a href="#" className="block py-2 px-4 text-sm  border-white border-bold">
                     About
                  </a>
                  <a href="#" className="block py-2 px-4 text-sm  border-white border-bold">
                     Services
                  </a>
                  <a href="#" className="block py-2 px-4 text-sm  border-white border-bold">
                     Contact
                  </a>
                  {user && (
                     <div className="py-2 px-4 text-sm  border-white border-bold">
                        <button onClick={toggleLogoutMenu}>{user.email}</button>
                        {showLogout && (
                           <div className="bg-white rounded-md shadow-xl">
                              <Button onClick={handleLogout} className="block px-4 py-2 text-sm  w-full text-left" variant={'secondary'}>
                                 Logout
                              </Button>
                           </div>
                        )}
                     </div>
                  )}
               </div>
            </nav>
         </div>
      </>
   );
}
