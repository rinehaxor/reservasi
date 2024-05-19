'use client';

import { useInternetStatus } from '@/hooks/useInternetStatus ';
import { useEffect } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InternetStatusChecker = () => {
   const isOnline = useInternetStatus();

   useEffect(() => {
      if (!isOnline) {
         toast.error('No internet connection. Please check your connection.');
      } else {
         return;
      }
   }, [isOnline]);

   return <ToastContainer />;
};

export default InternetStatusChecker;
