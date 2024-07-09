'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { IoLocationOutline } from 'react-icons/io5';
import { FiPhone } from 'react-icons/fi';
import { MdOutlineEmail } from 'react-icons/md';
import Link from 'next/link';

const cardVariants = {
   hidden: { opacity: 0, y: 100 },
   visible: { opacity: 2, y: 0, transition: { duration: 1 } },
};

export default function DescriptionHome({ contactRef }: any) {
   return (
      <div className="w-full">
         <motion.div className="card flex flex-col sm:flex-row gap-4 sm:gap-10 p-4 sm:mx-24 md:mx-48 mt-10 md:mt-20" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={cardVariants}>
            <div className="w-full sm:w-1/2 flex justify-center items-center">
               <div className="border-l-4 border-orange-500">
                  <p className="text-4xl sm:text-6xl font-bold ml-6">Suasana Alam</p>
                  <p className="text-xl sm:text-3xl font-thin ml-6 mt-5">Hotel ini menawarkan suasana alam yang mempesona, ada ruangan dihiasi dengan hiasan alami yang menenangkan.</p>
               </div>
            </div>
            <div className="w-full sm:w-1/2 flex justify-end items-center">
               <Image src="/assets/images/deskripsi1.jpg" alt="Deskripsi Gambar" width={0} height={0} sizes="100vw" className="w-full h-full" />
            </div>
         </motion.div>
         <motion.div className="card flex flex-col sm:flex-row gap-4 sm:gap-10 p-4 sm:mx-24 md:mx-48 mt-10 md:mt-20" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={cardVariants}>
            <div className="w-full sm:w-1/2 flex justify-center items-center">
               <div className="border-l-4 border-orange-500 mr-5">
                  <p className="text-4xl sm:text-6xl font-bold ml-6">Wisata</p>
                  <p className="text-xl sm:text-3xl font-thin ml-6 mt-5">Hotel Maerokoco berada di lokasi strategis di pusat kota, hanya beberapa langkah dari berbagai atraksi populer.</p>
                  <Link href="https://www.google.com/maps/search/wisata+blitar/@-8.0987554,112.1559832,14.27z?entry=ttu">
                     <Button className=" border-none ml-6 mt-10 w-full sm:w-1/4" variant={'secondary'}>
                        <span className="font-bold text-white">Jelajahi</span>
                     </Button>
                  </Link>
               </div>
            </div>
            <div className="w-full sm:w-1/2 flex justify-end items-center">
               <Image src="/assets/images/deskripsi2.webp" alt="Deskripsi Gambar" width={0} height={0} sizes="100vw" className="w-full h-full" />
            </div>
         </motion.div>
         <div className=" mt-10  md:mx-48 " ref={contactRef}>
            <h3 className="text-4xl sm:text-4xl font-bold mb-5 text-center">
               <span className="border-b-8 border-orange-500 inline-block">HUBUNGI KAMI</span>
            </h3>

            <div className=" flex md:flex-row gap-5 flex-col">
               <div className="w-full  bg-orange-500 rounded-sm text-white">
                  <IoLocationOutline className="mx-auto h-40 w-40 mt-5" />
                  <h3 className="font-bold text-2xl mx-3 text-center">Alamat</h3>
                  <p className="font-thin text-xl mx-3 text-center mb-5">Jl. Dr. Moh. Hatta No.3, Sentul, Kec. Kepanjenkidul, Kota Blitar</p>
               </div>
               <div className="w-full  bg-orange-500 rounded-sm text-white">
                  <FiPhone className="mx-auto h-40 w-40 mt-5" />
                  <h3 className="font-bold text-2xl mx-3 text-center">Hubungi Kami</h3>
                  <p className="font-thin text-xl mx-3 text-center mb-5">+62-342-801427</p>
               </div>
               <div className="w-full  bg-orange-500 rounded-sm text-white">
                  <MdOutlineEmail className="mx-auto h-40 w-40 mt-5" />
                  <h3 className="font-bold text-2xl mx-3 text-center">Email</h3>
                  <p className="font-thin text-xl mx-3 text-center mb-5">hotelmaerokoco03@gmail.com</p>
               </div>
            </div>
         </div>
         <motion.div className="flex flex-col items-center justify-center my-10 md:my-20 md:mx-48">
            <p className="text-4xl sm:text-4xl font-bold border-b-8 border-orange-500 mb-5">ALAMAT</p>
            <iframe
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3950.1138152166154!2d112.17037407632269!3d-8.089874380898156!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e78ec69f8d762b5%3A0xaa78c75b15c57c6a!2sHotel%20Maerokoco!5e0!3m2!1sid!2sid!4v1714650014215!5m2!1sid!2sid"
               width="100%"
               height="450"
               style={{ border: '0' }}
               allowFullScreen={true}
               loading="lazy"
               referrerPolicy="no-referrer-when-downgrade"
               title="Lokasi Hotel Maerokoco di Google Maps"
            ></iframe>
         </motion.div>
      </div>
   );
}
