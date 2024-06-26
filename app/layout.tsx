import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Inter as FontSans } from 'next/font/google';
import { cn } from '@/lib/utils';
import { SpeedInsights } from '@vercel/speed-insights/next';

import dynamic from 'next/dynamic';

const fontSans = FontSans({
   subsets: ['latin'],
   variable: '--font-sans',
});

const defaultUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000';

export const metadata = {
   metadataBase: new URL(defaultUrl),
   title: 'Hotel Maerokoco - Kota Blitar',
   description: 'Hotel Maerokoco Nyaman di Kota Blitar',
   icons: {
      icon: '/assets/favicon.ico',
   },
};

const InternetStatusChecker = dynamic(() => import('@/components/InternetStatusChecker'), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en" suppressHydrationWarning>
         <head>
            <link rel="icon" href="/assets/favicon.ico" />
            <meta property="og:image" content="/assets/images/logo.png" />
            <meta property="og:type" content="website" />
         </head>
         <body className={cn('min-h-screen bg-background font-sans antialiased', fontSans.variable)}>
            <main className="min-h-screen flex flex-col items-center">
               {children}
               {/* <InternetStatusChecker /> */}
            </main>
            <SpeedInsights />
         </body>
      </html>
   );
}
