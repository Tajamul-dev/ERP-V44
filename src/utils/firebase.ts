import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { User } from '../types';

const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with firestoreDatabaseId from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
// Set browser local persistence so users stay logged in across reloads
setPersistence(auth, browserLocalPersistence).catch((e: unknown) =>
  console.warn('Could not set auth persistence:', e)
);
export const googleProvider = new GoogleAuthProvider();
// Always show the account picker and consent screen on every sign-in.
googleProvider.setCustomParameters({ prompt: 'consent select_account' });

// Verify connection
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client appears offline.');
    }
  }
}
testFirestoreConnection();

export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    if (!fbUser) return null;

    const email = fbUser.email || 'user@globaloils.us';
    const name = fbUser.displayName || email.split('@')[0];
    const initials = name
      .split(' ')
      .map(w => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const isSuper = email.toLowerCase() === 'tajamul.sales@globaloils.us' || email.toLowerCase() === 'strangersyco@gmail.com';
    const user: User = {
      email,
      name,
      initials: initials || 'G',
      role: isSuper ? 'super_admin' : 'admin',
      isAdmin: true,
      isSuperAdmin: isSuper,
    };

    // Save profile to Firestore
    try {
      await setDoc(doc(db, 'users', fbUser.uid), {
        email: user.email,
        name: user.name,
        role: user.role,
        lastLogin: new Date().toISOString(),
      }, { merge: true });
    } catch (e) {
      console.warn('Could not persist user profile to Firestore:', e);
    }

    return user;
  } catch (error: any) {
    if (error?.code === 'auth/unauthorized-domain') {
      console.warn('Google Sign-In notice: current domain is not yet authorized in Firebase Console.');
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'current domain';
      const enhancedError = new Error(
        `Firebase domain unauthorized: "${currentHost}" has not been added to Authorized Domains in Firebase Console.`
      );
      (enhancedError as any).code = 'auth/unauthorized-domain';
      (enhancedError as any).domain = currentHost;
      (enhancedError as any).projectId = firebaseConfig.projectId;
      throw enhancedError;
    }
    console.warn('Google Sign-In was cancelled or failed:', error?.message || error);
    throw error;
  }
}

export async function logoutUser() {
  await fbSignOut(auth);
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

