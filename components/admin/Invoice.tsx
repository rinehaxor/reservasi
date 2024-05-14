import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';

// Refined styles
const styles = StyleSheet.create({
   page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 40,
   },
   section: {
      margin: 10,
      padding: 20,
      backgroundColor: '#f7f7f7',
      borderRadius: 12,
      shadow: '0 4px 8px rgba(0,0,0,0.1)',
      flexGrow: 1,
      fontSize: 12,
      lineHeight: 1.5,
   },
   header: {
      fontSize: 26,
      marginBottom: 20,
      textAlign: 'center',
      color: '#003366',
      paddingBottom: 10,
      fontWeight: 'bold',
   },
   subtitle: {
      fontSize: 18,
      margin: 10,
      color: '#0056b3',
      marginBottom: 5,
      paddingBottom: 3,
      borderBottom: '2px solid #0056b3',
   },
   text: {
      margin: 10,
      fontSize: 14,
      color: '#333333',
      marginBottom: 5,
   },
   image: {
      marginBottom: 15,
      width: 150,
      height: 100,
      borderRadius: 10,
   },
   footer: {
      marginTop: 25,
      fontSize: 14,
      textAlign: 'center',
      color: '#666666',
   },
   link: {
      color: '#0066cc',
      textDecoration: 'underline',
   },
});

// Document component
const MyDocument = ({ bookingData }: any) => (
   <Document>
      <Page size="A4" style={styles.page}>
         <Text style={styles.header}>Hotel Invoice</Text>

         <View style={styles.section}>
            <Text style={styles.subtitle}>Booking Details</Text>
            <Text style={styles.text}>Invoice Number: {bookingData.invoice_number}</Text>
            <Text style={styles.text}>Booking Date: {bookingData.bookingdate}</Text>
            <Text style={styles.text}>Check-in Date: {bookingData.checkindate}</Text>
            <Text style={styles.text}>Check-out Date: {bookingData.checkoutdate}</Text>
            <Text style={styles.text}>Room Type: {bookingData.room.name}</Text>
            <Text style={styles.text}>Total Price: {bookingData.total_price.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</Text>
            <Text style={styles.text}>Booking Status: {bookingData.booking_status}</Text>
            <Text style={styles.text}>Payment Status: {bookingData.payment_status}</Text>

            <Text style={styles.subtitle}>Customer Details</Text>
            <Text style={styles.text}>Name: {bookingData.name}</Text>
            <Text style={styles.text}>
               Email: <Text style={styles.link}>{bookingData.email}</Text>
            </Text>
            <Text style={styles.text}>Phone Number: {bookingData.phone_number}</Text>
            <Text style={styles.text}>Payment Account Name: {bookingData.payment_name}</Text>
            <Text style={styles.text}>Payment Account Number: {bookingData.payment_account_number}</Text>
         </View>
         <Text style={styles.footer}>Thank you for choosing us!</Text>
      </Page>
   </Document>
);

export default MyDocument;
