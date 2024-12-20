import DeployButton from '../components/DeployButton';
import AuthButton from '../components/AuthButton';
import { createClient } from '@/utils/supabase/server';
import ConnectSupabaseSteps from '@/components/tutorial/ConnectSupabaseSteps';
import SignUpUserSteps from '@/components/tutorial/SignUpUserSteps';
import Header from '@/components/Header';
import Hero from '@/components/home/Hero';
import DescriptionHome from '@/components/home/DescriptionHome';
import Footer from '@/components/home/Footer';
import Faq from '@/components/home/Faq';
import Home from '@/components/home/Home';

export default async function Index() {
   const canInitSupabaseClient = () => {
      // This function is just for the interactive tutorial.
      // Feel free to remove it once you have Supabase connected.
      try {
         createClient();
         return true;
      } catch (e) {
         return false;
      }
   };

   const isSupabaseConnected = canInitSupabaseClient();

   return (
      <>
         {/* <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
               <DeployButton />
               {isSupabaseConnected && <AuthButton />}
            </div>
         </nav> */}

         {/* <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
            <Header />
            <main className="flex-1 flex flex-col gap-6">
               <h2 className="font-bold text-4xl mb-4">Next steps</h2>
               {isSupabaseConnected ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
            </main>
         </div> */}

         {/* <div>
            {' '}
            <Hero />
         </div>
         <div>
            <DescriptionHome />
         </div>
         <Faq />

         <Footer /> */}
         <Home />
         {/* <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
            <p>
               Powered by{' '}
               <a href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs" target="_blank" className="font-bold hover:underline" rel="noreferrer">
                  Supabase
               </a>
            </p>
         </footer> */}
      </>
   );
}
