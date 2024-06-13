import React from 'react';

export default function Footer() {
   return (
      <div className="w-full h-auto bg-orange-500 font-bold  text-white">
         <div className="md:mx-48 flex md:flex-row justify-between flex-col mx-5 gap-5">
            <div className="md:w-1/2 mt-5">
               <h3 className="font-bold text-xl">Hotel Maerokoco</h3>
               <p className="font-thin text-lg text-justify mt-5">
                  {' '}
                  Hotel Maerokoco adalah akomodasi yang berlokasi di Kota Blitar, memiliki tempat strategis berdekatan dengan banyak tempat wisata. Hotel ini nyaman dan modern, menawarkan pelayanan terbaik untuk pengalaman menginap yang tak
                  terlupakan.
               </p>
            </div>
            <div className="md:w-1/2 mt-5">
               <h3 className="font-bold text-xl">Hubungi Kami</h3>
               <p className="font-thin text-lg mt-5">Jl. Dr. Moh. Hatta No.3, Sentul, Kec. Kepanjenkidul, Kota Blitar, Jawa Timur 66113 Indonesia</p>
               <p className="font-thin text-lg mt-5">
                  <span className="font-bold">Telp:</span> +62 342 801427
               </p>
            </div>
         </div>
         <div className="text-center mt-10">&copy;2024</div>
      </div>
   );
}
