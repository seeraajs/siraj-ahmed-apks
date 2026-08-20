import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";

export async function testFirebaseConnection() {
  try {
    const snapshot = await getDocs(collection(db, "apps"));

    console.log(
      "Firebase + Firestore connection successful!",
      snapshot.docs.length,
      "documents found."
    );

    return true;
  } catch (error) {
    console.error("Firebase connection failed:", error);
    return false;
  }
}