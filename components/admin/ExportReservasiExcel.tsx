import { Bookings } from '@/app/admin/reservasi/column';
import * as XLSX from 'xlsx';
import { Button } from '../ui/button';
import { RiFileExcel2Line } from 'react-icons/ri';

const ExportExcel = ({ bookings }: any) => {
   const handleExport = () => {
      const dataToExport = bookings.map((booking: any) => ({
         'Invoice Number': booking.invoice_number ?? '',
         'Nama Tamu': booking.name ?? '',
         'Room Name': booking.room ? booking.room.name : '',
         'Check-In Date': booking.checkindate ?? '',
         'Check-Out Date': booking.checkoutdate ?? '',
         'Total Price': booking.total_price?.toString() ?? '',
         'Status Pembayaran': booking.payment_status ?? '',
         'Status Reservasi': booking.booking_status ?? '',
      }));

      const ws = XLSX.utils.json_to_sheet(dataToExport);

      const colWidths = [{ wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
      ws['!cols'] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Reservasi');

      XLSX.writeFile(wb, 'Laporan_Reservasi_Selesai.xlsx');
   };

   return (
      <Button onClick={handleExport} className="bg-green-500 text-white">
         <RiFileExcel2Line className="w-5 h-5" />
         <span className="ml-2">Export Excel</span>
      </Button>
   );
};

export default ExportExcel;
