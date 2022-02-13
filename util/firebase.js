const { initializeApp } = require("firebase/app");
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API,
  authDomain: "document-e0844.firebaseapp.com",
  projectId: "document-e0844",
  storageBucket: "document-e0844.appspot.com",
  messagingSenderId: "537778026868",
  appId: "1:537778026868:web:abae50722fa352e065d421",
  measurementId: "G-4G0VH4K7ZD"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);


module.exports =  app