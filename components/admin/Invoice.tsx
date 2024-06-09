import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

// Refined styles to match the provided design
const styles = StyleSheet.create({
   page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 20,
      fontSize: 22,
   },
   section: {
      margin: 10,
      padding: 10,
      fontSize: 10,
   },
   header: {
      fontSize: 16,
      marginBottom: 10,
      textAlign: 'center',
      color: '#003366',
      fontWeight: 'bold',
   },
   label: {
      fontSize: 10,
      fontWeight: 'bold',
   },
   text: {
      fontSize: 10,
      marginBottom: 5,
   },
   contact: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#003366',
   },
   table: {
      width: '100%',
      borderStyle: 'solid',
      borderWidth: 1,
      margin: 10,
   },
   tableRow: {
      flexDirection: 'row',
   },
   tableColHeader: {
      width: '50%',
      borderStyle: 'solid',
      borderWidth: 1,
      backgroundColor: '#f0f0f0',
      padding: 5,
   },
   tableCol: {
      width: '50%',
      borderStyle: 'solid',
      borderWidth: 1,
      padding: 5,
   },
   footer: {
      marginTop: 20,
      fontSize: 10,
      textAlign: 'center',
      color: '#666666',
   },
   row: {
      flexDirection: 'row',
      marginBottom: 5,
   },
   cellLabel: {
      width: '30%',
      fontSize: 10,
      fontWeight: 'bold',
   },
   cellText: {
      width: '70%',
      fontSize: 10,
   },
});

const formatDate = (dateString: Date) => {
   return format(new Date(dateString), 'yyyy-MM-dd');
};
// Document component
const MyDocument = ({ bookingData }: any) => (
   <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
         <Text style={styles.header}>Booking Confirmation</Text>

         <View style={styles.section}>
            <View style={styles.row}>
               <Text style={styles.cellLabel}>Booking Invoice:</Text>
               <Text style={styles.cellText}>{bookingData.invoice_number}</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.cellLabel}>Name:</Text>
               <Text style={styles.cellText}>{bookingData.name}</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.cellLabel}>Email:</Text>
               <Text style={styles.cellText}>{bookingData.email}</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.cellLabel}>Nomer Telepone:</Text>
               <Text style={styles.cellText}>{bookingData.phone_number}</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.cellLabel}>Payment Status:</Text>
               <Text style={styles.cellText}>{bookingData.payment_status}</Text>
            </View>
            <View style={styles.row}>
               <Text style={styles.cellLabel}>Booking Status:</Text>
               <Text style={styles.cellText}>{bookingData.booking_status}</Text>
            </View>

            <View style={styles.table}>
               <View style={styles.tableRow}>
                  <View style={styles.tableColHeader}>
                     <Text style={styles.text}>Tgl Reservasi</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                     <Text style={styles.text}>Tipe Kamar</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                     <Text style={styles.text}> Nama Pembayar</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                     <Text style={styles.text}>Norek Pembayaran</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                     <Text style={styles.text}>Check-in</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                     <Text style={styles.text}>Check-out</Text>
                  </View>
                  <View style={styles.tableColHeader}>
                     <Text style={styles.text}>Total</Text>
                  </View>
               </View>
               <View style={styles.tableRow}>
                  <View style={styles.tableCol}>
                     <Text style={styles.text}>{formatDate(bookingData.bookingdate)}</Text>
                  </View>
                  <View style={styles.tableCol}>
                     <Text style={styles.text}>{bookingData.room.name}</Text>
                  </View>
                  <View style={styles.tableCol}>
                     <Text style={styles.text}>{bookingData.payment_name}</Text>
                  </View>
                  <View style={styles.tableCol}>
                     <Text style={styles.text}>{bookingData.payment_account_number}</Text>
                  </View>
                  <View style={styles.tableCol}>
                     <Text style={styles.text}>{bookingData.checkindate}</Text>
                  </View>
                  <View style={styles.tableCol}>
                     <Text style={styles.text}>{bookingData.checkoutdate}</Text>
                  </View>
                  <View style={styles.tableCol}>
                     <Text style={styles.text}>{bookingData.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Text>
                  </View>
               </View>
            </View>

            <Text style={styles.footer}>Thank you for booking with us!</Text>
         </View>
      </Page>
   </Document>
);

export default MyDocument;
