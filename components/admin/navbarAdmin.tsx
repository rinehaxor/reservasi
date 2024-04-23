import React from 'react';
import DeployButton from '../DeployButton';
import AuthButton from '../AuthButton';

export default function NavbarAdmin() {
   return (
      <div>
         <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
               <DeployButton />
               <AuthButton />
            </div>
         </nav>{' '}
      </div>
   );
}
