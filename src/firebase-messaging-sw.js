importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
  firebase.initializeApp({
    apiKey: "AIzaSyBUUHyIrXA3nv5cGHOOrj-ugdo6HiblQKM",
    authDomain: "omnichannel-3d3e1.firebaseapp.com",
    databaseURL: "https://omnichannel-3d3e1.firebaseio.com",
    projectId: "omnichannel-3d3e1",
    storageBucket: "omnichannel-3d3e1.appspot.com",
    messagingSenderId: "647359758084",
    appId: "1:647359758084:web:056430784643dc4670da51",
    measurementId: "G-8VWBZL1G0C"
});
  const messaging = firebase.messaging();

messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging); //<--this
messaging.onMessage = messaging.onMessage.bind(messaging); //<-- and this `