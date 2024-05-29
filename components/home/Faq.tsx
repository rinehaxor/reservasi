// Faq.tsx
'use client';
import { useState, forwardRef } from 'react';

const faqData = [
   {
      question: 'Apa itu Hotel Merokoco?',
      answer: 'Hotel Kami adalah akomodasi yang menawarkan kenyamanan, dan layanan terbaik untuk para tamu kami.',
   },
   {
      question: 'Berapa biaya menginap di Hotel Kami?',
      answer: 'Biaya menginap di Hotel Kami bervariasi tergantung pada jenis kamar. Harga kamar mulai dari Rp 150.000 per malam. Silakan kunjungi halaman Room kami untuk informasi lebih lanjut.',
   },
   {
      question: 'Di mana lokasi Hotel Kami?',
      answer: 'Hotel Kami berlokasi di pusat kota, dekat dengan berbagai  wisata dan pusat perbelanjaan. Alamat lengkapnya adalah Jl. Moh. Hatta  No. 3, Ko Blitar.',
   },
   {
      question: 'Apa fasilitas yang tersedia di Hotel Kami?',
      answer: 'Hotel Kami menawarkan berbagai fasilitas termasuk tempat parkir yang luas, layanan kamar 24 jam, dan Wi-Fi gratis di seluruh area hotel.',
   },
   {
      question: 'Bagaimana cara melakukan reservasi?',
      answer: 'Anda bisa melakukan reservasi melalui website kami dengan mengisi formulir reservasi online yang ada pada halaman room, atau menghubungi kami langsung di nomor telepon (021) 12345678.',
   },
];

const Faq = forwardRef<HTMLDivElement>((props, ref) => {
   const [openIndex, setOpenIndex] = useState<number | null>(null);

   const toggleFaq = (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
   };

   return (
      <div className="w-full mt-8 p-4 bg-white rounded-lg" ref={ref}>
         <h2 className="text-2xl font-bold mb-4 text-center">Tanya Jawab Umum</h2>
         {faqData.map((item, index) => (
            <div key={index} className="mb-4 md:mx-40">
               <button onClick={() => toggleFaq(index)} className="w-full flex justify-between items-center py-2 px-4 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
                  <span className="font-semibold md:text-2xl">{item.question}</span>
                  <span className="md:text-3xl">{openIndex === index ? '−' : '+'}</span>
               </button>
               {openIndex === index && <div className="mt-2 px-4 text-xl">{item.answer}</div>}
            </div>
         ))}
      </div>
   );
});

Faq.displayName = 'Faq';

export default Faq;
