'use client';
import { useRef } from 'react';
import dynamic from 'next/dynamic';

const Hero = dynamic(() => import('@/components/home/Hero'), { ssr: false });
const DescriptionHome = dynamic(() => import('@/components/home/DescriptionHome'), { ssr: false });
const Footer = dynamic(() => import('@/components/home/Footer'), { ssr: false });
const Faq = dynamic(() => import('@/components/home/Faq'), { ssr: false });

export default function Home() {
   const faqRef = useRef<HTMLDivElement>(null);

   return (
      <>
         <Hero faqRef={faqRef} />
         <DescriptionHome />
         <Faq ref={faqRef} />
         <Footer />
      </>
   );
}
