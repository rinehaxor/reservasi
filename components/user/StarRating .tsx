import React from 'react';

const StarRating = ({ rating }: any) => {
   const fullStars = Math.floor(rating);
   const halfStar = rating % 1 >= 0.5 ? 1 : 0;
   const emptyStars = 5 - fullStars - halfStar;

   return (
      <div className="flex items-center">
         {[...Array(fullStars)].map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 .587l3.668 7.429 8.2 1.193-5.918 5.758 1.396 8.133L12 18.896l-7.346 3.872 1.396-8.133L.132 9.209l8.2-1.193L12 .587z" />
            </svg>
         ))}
         {halfStar === 1 && (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
               <defs>
                  <linearGradient id="half" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="50%" style={{ stopColor: 'currentColor', stopOpacity: 1 }} />
                     <stop offset="50%" style={{ stopColor: 'gray', stopOpacity: 1 }} />
                  </linearGradient>
               </defs>
               <path d="M12 .587l3.668 7.429 8.2 1.193-5.918 5.758 1.396 8.133L12 18.896l-7.346 3.872 1.396-8.133L.132 9.209l8.2-1.193L12 .587z" fill="url(#half)" />
            </svg>
         )}
         {[...Array(emptyStars)].map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
               <path d="M12 .587l3.668 7.429 8.2 1.193-5.918 5.758 1.396 8.133L12 18.896l-7.346 3.872 1.396-8.133L.132 9.209l8.2-1.193L12 .587z" />
            </svg>
         ))}
         <p className="ml-2 text-xl font-bold">{rating.toFixed(1)}</p>
      </div>
   );
};

export default StarRating;
