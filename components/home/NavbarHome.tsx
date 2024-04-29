'use client';
import React, { useState } from 'react';

export default function NavbarHome() {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <>
         <div className="w-full flex flex-col items-center text-white relative z-20">
            <nav className="w-full flex justify-center h-16">
               {/* className="bg-blue-900 text-white w-full"> */}

               <div className="flex justify-between items-center w-full px-4 h-16 md:mx-48 ">
                  {/* className="flex justify-between items-center w-full px-4 h-16"> */}
                  {/* Logo on the left */}
                  <div className="flex items-center space-x-4 flex-grow ">
                     <a href="#" className="flex items-center py-5 px-2 text-gray-200 hover:text-gray-100">
                        <span className="font-bold">Brand</span>
                     </a>
                  </div>

                  {/* Primary nav on the right */}
                  <div className="hidden md:flex items-center space-x-1">
                     <a href="#" className="py-5 px-3 hover:text-gray-100">
                        Home
                     </a>
                     <a href="#" className="py-5 px-3 hover:text-gray-100">
                        About
                     </a>
                     <a href="#" className="py-5 px-3 hover:text-gray-100">
                        Services
                     </a>
                     <a href="#" className="py-5 px-3 hover:text-gray-100">
                        Contact
                     </a>
                  </div>

                  {/* Mobile button */}
                  <div className="md:hidden flex items-center">
                     <button onClick={() => setIsOpen(!isOpen)} className="z-40">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                        </svg>
                     </button>
                  </div>
               </div>

               {/* Mobile Menu */}
               <div className={`${isOpen ? 'block' : 'hidden'}  absolute mt-3  z-30  md:hidden`}>
                  <a href="#" className="block py-2 px-4 text-sm hover:border-b border-white border-bold">
                     Home
                  </a>
                  <a href="#" className="block py-2 px-4 text-sm hover:border-b border-white border-bold">
                     About
                  </a>
                  <a href="#" className="block py-2 px-4 text-sm hover:border-b border-white border-bold">
                     Services
                  </a>
                  <a href="#" className="block py-2 px-4 text-sm hover:border-b border-white border-bold">
                     Contact
                  </a>
               </div>
            </nav>
         </div>
      </>
   );
}
