
import firebase from "firebase";
import "firebase/auth";
import   "firebase/firestore";
import "firebase/storage";
import "firebase/functions";



const firebaseConfig = {
    apiKey: "AIzaSyBvMggFU6WNtHOOQEPS7j4_mg-ew0gVTxQ",
    authDomain: "ijaz-webapp.firebaseapp.com",
    projectId: "ijaz-webapp",
    storageBucket: "ijaz-webapp.appspot.com",
    messagingSenderId: "153916250656",
    appId: "1:153916250656:web:9ac0756affeb2d22037a45"
  //  measurementId: "G-Y3FXN2DW7N",
};
const app = firebase.initializeApp(firebaseConfig);

export const auth = app.auth();
export const storage = app.storage();
export { firebaseConfig };
export const db = app.firestore()
// .enablePersistence().catch((err) => {
//   if (err.code == 'failed-precondition') {
//       console.log('failed-precondition')
//   } else if (err.code == 'unimplemented') {
//     console.log('failed-precondition')
//     'unimplemented'
//   }
// });

firebase.firestore().settings({
  experimentalForceLongPolling: true,
  ignoreUndefinedProperties: true,
  cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

export const functions = app.functions()
export default app;
