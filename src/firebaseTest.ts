import { collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function testFirebaseConnection() {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'applications'), where('published', '==', true), limit(1))
    );

    console.log(
      'Firebase + Firestore connection successful!',
      snapshot.docs.length,
      'published documents found in applications.'
    );

    return true;
  } catch (error) {
    console.error('Firebase connection failed for public application query:', error);
    return false;
  }
}