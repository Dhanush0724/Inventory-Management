import { auth, db, googleProvider } from "../firebase";
import { signInWithPopup, signOut, User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface AppUser {
  uid: string;
  email: string;
  role: string; // "admin" or "staff"
}

// Google Sign-in & Save User Role in Firestore
export const signInWithGoogle = async (): Promise<AppUser | null> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    if (!user.email) return null;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    let role = "staff"; // Default role

    if (userSnap.exists()) {
      role = userSnap.data().role;
    } else {
      // First-time login: Store default role in Firestore
      await setDoc(userRef, { email: user.email, role });
    }

    return { uid: user.uid, email: user.email, role };
  } catch (error) {
    console.error("Error during sign-in:", error);
    return null;
  }
};

// Logout function
export const logout = async () => {
  await signOut(auth);
};
