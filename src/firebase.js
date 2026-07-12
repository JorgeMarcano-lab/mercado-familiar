import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Config de Firebase del proyecto mercado-familiar
const firebaseConfig = {
  apiKey: "AIzaSyC75c_VHyTG_kagc8E3D2ClQo3q7krWp_4",
  authDomain: "mercado-familiar-392e0.firebaseapp.com",
  projectId: "mercado-familiar-392e0",
  storageBucket: "mercado-familiar-392e0.firebasestorage.app",
  messagingSenderId: "962508706960",
  appId: "1:962508706960:web:504cea641147d875c53415",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
