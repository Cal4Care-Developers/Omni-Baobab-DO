importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');
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
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
      }).catch(function(err) {
        console.log('Service worker registration failed, error:', err);
      });
    }
  messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
      body: 'Background Message body.',
      icon: '/firebase-logo.png'
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });
  // [END on_background_message]

messaging.onTokenRefresh = messaging.onTokenRefresh.bind(messaging); //<--this
messaging.onMessage = messaging.onMessage.bind(messaging); //<-- and this `