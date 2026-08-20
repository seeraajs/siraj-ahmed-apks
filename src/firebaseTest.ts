import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function testFirebaseConnection() {
  try {
    const snapshot = await getDocs(collection(db, 'applications'));

    console.log(
      'Firebase + Firestore connection successful!',
      snapshot.docs.length,
      'documents found in applications.'
    );

    return true;
  } catch (error) {
    console.error('Firebase connection failed for applications collection:', error);
    return false;
  }
}