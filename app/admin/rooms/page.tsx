'use client';
import React from 'react';
import ReadRoom from '@/components/admin/readRoom';
import NavbarAdmin from '@/components/admin/navbarAdmin';
import { createClient } from '@/utils/supabase/client';
import SideBar from '@/components/admin/SideBar';
import { Room, columns } from './columns';
import { DataTable } from './data-table';
import { WaveSVG } from '@/components/ui/waves';

async function getData(): Promise<Room[]> {
   // Fetch data from your API here.
   const supabase = createClient();
   let { data, error } = await supabase.from('rooms').select('*');

   if (error) {
      console.error('Error fetching rooms:', error);
      return [];
   }

   if (!Array.isArray(data)) {
      return [];
   }

   // Assuming the structure of your room data is compatible with the Payment type
   // You might need to adjust the fields or structure here to match your Payment type
   return data.map((item) => {
      // Assuming 'item' needs to be transformed or validated:
      return {
         id: item.id,
         name: item.name,
         type: item.type,
         description: item.description,
         price_per_night: item.price_per_night,
         image_url: item.image_url || '', // Ensure image_url has a default
      } as Room;
   });
}

export default function Page() {
   const [data, setData] = React.useState<Room[]>([]);
   const [loading, setLoading] = React.useState(true);

   React.useEffect(() => {
      async function fetchData() {
         setLoading(true);
         const fetchedData = await getData();
         setData(fetchedData);
         setLoading(false);
      }

      fetchData();
   }, []);

   if (loading) {
      return <div>Loading...</div>;
   }
   return (
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
         <div className="w-full">
            {/* <NavbarAdmin /> */}
            <div className="flex w-full">
               {/* Sidebar that takes a fixed width */}
               <div className="w-[14%]">
                  <SideBar />
               </div>

               {/* Main content area for DataTable, taking remaining space */}
               <div className="flex-1 py-10 px-10">
                  {' '}
                  {/* Menambah padding secara horizontal */}
                  <DataTable columns={columns} data={data} />
               </div>
               {/* <ReadRoom /> */}
            </div>
         </div>
         <WaveSVG />
      </div>
   );
}
