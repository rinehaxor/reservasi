import React from 'react';

export default function Spinner() {
   return (
      <div className="flex flex-1 justify-center items-center mt-10">
         <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
   );
}
