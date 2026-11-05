import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  Firestore,
  writeBatch,
} from 'firebase/firestore';
import { getFirebaseApp } from './firebaseConfig';
import { FavoriteWord, HistoryEntry } from '../types';

let db: Firestore | null = null;

/**
 * Get Firestore instance (singleton)
 */
function getFirestoreDb(): Firestore {
  if (!db) {
    const app = getFirebaseApp();
    db = getFirestore(app);
  }
  return db;
}

/**
 * Gets the Firestore collection path for a user's data.
 */
function getUserCollection(
  userId: string,
  collectionName: 'favorites' | 'history'
): string {
  return `users/${userId}/${collectionName}`;
}

/**
 * Adds a word to favorites.
 */
export async function addFavorite(
  userId: string,
  word: string
): Promise<void> {
  const firestore = getFirestoreDb();
  const colPath = getUserCollection(userId, 'favorites');
  const docRef = doc(firestore, colPath, word);

  const favorite: FavoriteWord = {
    word,
    addedAt: Date.now(),
  };

  await setDoc(docRef, favorite);
}

/**
 * Removes a word from favorites.
 */
export async function removeFavorite(
  userId: string,
  word: string
): Promise<void> {
  const firestore = getFirestoreDb();
  const colPath = getUserCollection(userId, 'favorites');
  const docRef = doc(firestore, colPath, word);

  await deleteDoc(docRef);
}

/**
 * Gets all favorites for a user.
 */
export async function getFavorites(userId: string): Promise<string[]> {
  const firestore = getFirestoreDb();
  const colPath = getUserCollection(userId, 'favorites');

  try {
    const q = query(collection(firestore, colPath), orderBy('addedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.id);
  } catch {
    // If no index or empty collection, return empty array
    return [];
  }
}

/**
 * Adds a word to history.
 */
export async function addToHistory(
  userId: string,
  word: string
): Promise<void> {
  const firestore = getFirestoreDb();
  const colPath = getUserCollection(userId, 'history');
  const docRef = doc(firestore, colPath, word);

  const entry: HistoryEntry = {
    word,
    viewedAt: Date.now(),
  };

  await setDoc(docRef, entry);
}

/**
 * Gets all history for a user.
 */
export async function getHistory(userId: string): Promise<string[]> {
  const firestore = getFirestoreDb();
  const colPath = getUserCollection(userId, 'history');

  try {
    const q = query(collection(firestore, colPath), orderBy('viewedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.id);
  } catch {
    // If no index or empty collection, return empty array
    return [];
  }
}

/**
 * Clears all history for a user.
 */
export async function clearHistory(userId: string): Promise<void> {
  const firestore = getFirestoreDb();
  const colPath = getUserCollection(userId, 'history');
  const q = query(collection(firestore, colPath));

  const snapshot = await getDocs(q);

  if (snapshot.empty) return;

  const batch = writeBatch(firestore);
  snapshot.docs.forEach((docSnapshot) => {
    batch.delete(docSnapshot.ref);
  });

  await batch.commit();
}
