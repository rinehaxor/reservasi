// components/ExportPDF.js
import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Bookings } from '@/app/admin/reservasi/column';

const styles = StyleSheet.create({
   page: {
      flexDirection: 'column',
      backgroundColor: '#FFFFFF',
      padding: 20,
   },
   section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
   },
   header: {
      fontSize: 24,
      marginBottom: 20,
      textAlign: 'center',
      textDecoration: 'underline',
   },
   text: {
      fontSize: 12,
   },
   table: {
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#bfbfbf',
      marginBottom: 10,
   },
   tableRow: {
      margin: 'auto',
      flexDirection: 'row',
   },
   tableColHeader: {
      width: '14.28%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#bfbfbf',
      backgroundColor: '#f3f3f3',
   },
   tableCol: {
      width: '14.28%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderColor: '#bfbfbf',
   },
   tableCellHeader: {
      margin: 5,
      fontSize: 10,
      fontWeight: 'bold',
   },
   tableCell: {
      margin: 5,
      fontSize: 10,
   },
   footer: {
      marginTop: 10,
      textAlign: 'center',
      fontSize: 10,
   },
});

const ExportPDF = ({ bookings }: any) => {
   const totalPrice = bookings.reduce((sum: number, booking: Bookings) => sum + booking.total_price, 0);

   return (
      <Document>
         <Page size="A4" style={styles.page}>
            <View style={styles.section}>
               <Text style={styles.header}>Laporan Reservasi Selesai</Text>
               <View style={styles.table}>
                  <View style={styles.tableRow}>
                     <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>No</Text>
                     </View>
                     <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>Nomor Invoice</Text>
                     </View>
                     <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>Jenis Kamar</Text>
                     </View>
                     <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>Status Reservasi</Text>
                     </View>
                     <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>Status Pembayaran</Text>
                     </View>
                     <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>Tgl. Checkin / Tgl. Checkout</Text>
                     </View>
                     <View style={styles.tableColHeader}>
                        <Text style={styles.tableCellHeader}>Total Harga</Text>
                     </View>
                  </View>
                  {bookings.map((booking: Bookings, index: number) => (
                     <View style={styles.tableRow} key={index}>
                        <View style={styles.tableCol}>
                           <Text style={styles.tableCell}>{index + 1}</Text>
                        </View>
                        <View style={styles.tableCol}>
                           <Text style={styles.tableCell}>{booking.invoice_number}</Text>
                        </View>
                        <View style={styles.tableCol}>
                           <Text style={styles.tableCell}>{booking.room.name}</Text>
                        </View>
                        <View style={styles.tableCol}>
                           <Text style={styles.tableCell}>{booking.booking_status}</Text>
                        </View>
                        <View style={styles.tableCol}>
                           <Text style={styles.tableCell}>{booking.payment_status}</Text>
                        </View>
                        <View style={styles.tableCol}>
                           <Text style={styles.tableCell}>{`${booking.checkindate} / ${booking.checkoutdate}`}</Text>
                        </View>
                        <View style={styles.tableCol}>
                           <Text style={styles.tableCell}>{booking.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Text>
                        </View>
                     </View>
                  ))}
                  <View style={styles.tableRow}>
                     <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                     </View>
                     <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                     </View>
                     <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                     </View>
                     <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                     </View>
                     <View style={styles.tableCol}>
                        <Text style={styles.tableCell}></Text>
                     </View>
                     <View style={styles.tableCol}>
                        <Text style={styles.tableCellHeader}>Total:</Text>
                     </View>
                     <View style={styles.tableCol}>
                        <Text style={styles.tableCellHeader}>{totalPrice.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Text>
                     </View>
                  </View>
               </View>
            </View>
         </Page>
      </Document>
   );
};

export default ExportPDF;
