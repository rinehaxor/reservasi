import { Bookings } from '@/app/admin/reservasi/column';
import * as XLSX from 'xlsx';
import { Button } from '../ui/button';

const ExportExcel = ({ bookings }: any) => {
   const handleExport = () => {
      const dataToExport = bookings.map((booking: Bookings) => ({
         'Invoice Number': booking.invoice_number,
         'Guest Name': booking.name,
         'Room Name': booking.room.name,
         'Check-In Date': booking.checkindate,
         'Check-Out Date': booking.checkoutdate,
         'Total Price': booking.total_price,
         'Payment Status': booking.payment_status,
         'Booking Status': booking.booking_status,
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reservasi');

      XLSX.writeFile(wb, 'Laporan_Reservasi_Selesai.xlsx');
   };

   return (
      <Button onClick={handleExport} className="bg-green-500 text-white">
         Download Laporan Excel
      </Button>
   );
};

export default ExportExcel;
