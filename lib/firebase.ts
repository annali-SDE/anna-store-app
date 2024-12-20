// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY as string,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN as string,
	projectId: process.env.FIREBASE_PROJECT_ID as string,
	storageBucket: 'anna-shop-app-fa932.firebasestorage.app',
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID as string,
	appId: process.env.FIREBASE_APP_ID as string,
	measurementId: process.env.FIREBASE_MEASUREMENT_ID as string
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;
