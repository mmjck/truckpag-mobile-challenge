import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import {
  Auth,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { User } from "../types";
import { getFirebaseApp } from "./firebaseConfig";

let auth: Auth | null = null;

/**
 * Get Firebase Auth instance (singleton)
 * Uses AsyncStorage for session persistence
 */
function getFirebaseAuth(): Auth {
  if (!auth) {
    const app = getFirebaseApp();
    try {
      // Try to initialize with persistence
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });
    } catch {
      // If already initialized, get the existing instance
      auth = getAuth(app);
    }
  }
  return auth;
}

/**
 * Convert Firebase user to our User type
 */
function toUser(firebaseUser: FirebaseUser): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
  };
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return toUser(credential.user);
}

/**
 * Sign up with email, password, and display name
 */
export async function signUp(
  email: string,
  password: string,
  displayName: string,
): Promise<User> {
  const auth = getFirebaseAuth();
  const credential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  await updateProfile(credential.user, { displayName });
  return toUser(credential.user);
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const auth = getFirebaseAuth();
  await firebaseSignOut(auth);
}

/**
 * Get current user
 */
export function getCurrentUser(): User | null {
  const auth = getFirebaseAuth();
  return auth.currentUser ? toUser(auth.currentUser) : null;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(
  callback: (user: User | null) => void,
): () => void {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, (firebaseUser) => {
    callback(firebaseUser ? toUser(firebaseUser) : null);
  });
}
