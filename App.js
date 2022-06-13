/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import axios from 'axios';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { RazorpayApiKey } from './config';
import RazorpayCheckout from 'react-native-razorpay';




const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const [product, setProduct] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const onPay = async () => {
   
    setPaymentProcessing(true);
    const order = await createOrder();
    console.log(order)
    var options = {
      name: "product 1",
      image: "product image",
      description: "product description",
      order_id: order.id,
      key: RazorpayApiKey,
      prefill: {
        email: 'useremail@example.com',
        contact: '9191919191',
        name: 'John Doe',
      },
      theme: { color: '#a29bfe' },
    };
    RazorpayCheckout.open(options)
      .then(async(transaction) => {
        const validSignature = await verifyPayment(order.id, transaction);
       
      })
      .catch((error)=>{
        console.log(error)
      });
    setPaymentProcessing(false);
  };

  const createOrder = async () => {

    const { data } = await axios.post(
      'https://72f5-2405-201-d025-d01e-94e8-2d03-fe12-fa55.in.ngrok.io/createOrder',
      {
        amount: 200 * 100,
        currency: 'INR',
      },
    );
    return data;
  };

  const verifyPayment = async (orderID, transaction) => {
    console.log("orderId",orderID)
    const { data } = await axios.post(
      'https://72f5-2405-201-d025-d01e-94e8-2d03-fe12-fa55.in.ngrok.io/verifySignature',
      {
        orderID: orderID,
        transaction: transaction,
      },
    );
    return data.validSignature;
  };
  
  return (
    <View style={styles.screen}>
    <Text style={styles.heading}>Checkout</Text>
    <Text style={styles.title}>Product 1</Text>
    <Text style={styles.description}>Product description</Text>
    <TouchableOpacity style={styles.button} onPress={onPay}>
     
        <Text style={styles.buttonText}>Buy for ₹ {20000/ 100}</Text>
    
    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    marginTop: 50,
    fontSize: 28,
    color: '#a29bfe',
  },
  image: {
    height: 300,
    width: 300,
    marginTop: 50,
    borderRadius: 10,
  },
  title: {
    marginTop: 30,
    fontSize: 22,
    textAlign: 'center',
    width: '80%',
    color: '#a29bfe',
  },
  description: {
    width: '80%',
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    width: '80%',
    backgroundColor: '#a29bfe',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 50,
    position: 'absolute',
    bottom: 0,
    marginBottom: 50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
  },
});

export default App;
