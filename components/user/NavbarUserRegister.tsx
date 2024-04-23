import React from 'react';
import DeployButton from '../DeployButton';

export default function NavbarUserRegister() {
   return (
      <>
         <div className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
               <div className="font-bold text-lg font-mono"> Hotel Merokoco</div>
               <DeployButton />
            </div>

            {/* <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
      
               </div> */}
         </div>
      </>
   );
}
