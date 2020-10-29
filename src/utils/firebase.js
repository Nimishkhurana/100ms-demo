import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyD32MkcA6AIcikv6_2rlPZVrPaVbA8dl5Q',
  authDomain: 'brytecam-demo.firebaseapp.com',
  databaseURL: 'https://brytecam-demo.firebaseio.com',
  projectId: 'brytecam-demo',
  storageBucket: 'brytecam-demo.appspot.com',
  messagingSenderId: '355164085281',
  appId: '1:355164085281:web:d005f0f4a9903211af1760',
  measurementId: 'G-PR9RLREJZN',
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export default firebase;
export { firestore };
