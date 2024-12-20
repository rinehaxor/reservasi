'use client';
import { useRef } from 'react';
import Hero from '@/components/home/Hero';
import DescriptionHome from '@/components/home/DescriptionHome';
import Footer from '@/components/home/Footer';
import Faq from '@/components/home/Faq';

export default function Home() {
   const faqRef = useRef<HTMLDivElement>(null);
   const contactRef = useRef<HTMLDivElement>(null);

   return (
      <>
         <Hero faqRef={faqRef} contactRef={contactRef} />
         <DescriptionHome contactRef={contactRef} />
         <Faq ref={faqRef} />
         <Footer />
      </>
   );
}
