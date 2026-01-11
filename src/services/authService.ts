// Authentication service for Indie Pulse
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User,
  UserCredential,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { UserProfile, UserSettings, UserSubscription } from '../types/user';

export interface AuthError {
  code: string;
  message: string;
}

export interface SignUpData {
  email: string;
  password: string;
  displayName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Sign up with email and password
export const signUp = async (data: SignUpData): Promise<UserCredential> => {
  const { email, password, displayName } = data;

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  // Update display name if provided
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }

  // Create user document in Firestore
  await createUserDocument(userCredential.user, displayName);

  return userCredential;
};

// Sign in with email and password
export const signIn = async (data: SignInData): Promise<UserCredential> => {
  const { email, password } = data;
  return signInWithEmailAndPassword(auth, email, password);
};

// Sign out
export const signOut = async (): Promise<void> => {
  return firebaseSignOut(auth);
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  return sendPasswordResetEmail(auth, email);
};

// Subscribe to auth state changes
export const subscribeToAuthState = (
  callback: (user: User | null) => void
): (() => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

// Create user document in Firestore
const createUserDocument = async (
  user: User,
  displayName?: string
): Promise<void> => {
  const userRef = doc(db, 'users', user.uid);

  const defaultSettings: UserSettings = {
    currency: 'JPY',
    timezone: 'Asia/Tokyo',
    language: 'ja',
    notifications: {
      email: {
        weeklyReport: true,
        monthlyReport: true,
        alerts: true,
      },
      push: {
        mrrChanges: true,
        churnAlerts: true,
        milestones: true,
        aiInsights: true,
      },
    },
  };

  const defaultSubscription: UserSubscription = {
    plan: 'starter',
    status: 'trialing',
    currentPeriodStart: new Date().toISOString(),
    currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days trial
    cancelAtPeriodEnd: false,
    trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
  };

  await setDoc(userRef, {
    profile: {
      id: user.uid,
      email: user.email,
      displayName: displayName || user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    settings: defaultSettings,
    subscription: defaultSubscription,
    alerts: [],
  });
};

// Get user profile from Firestore
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data().profile as UserProfile;
  }

  return null;
};

// Error message mapping
export const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'このメールアドレスは既に使用されています',
    'auth/invalid-email': '無効なメールアドレスです',
    'auth/operation-not-allowed': 'この操作は許可されていません',
    'auth/weak-password': 'パスワードが弱すぎます。6文字以上にしてください',
    'auth/user-disabled': 'このアカウントは無効化されています',
    'auth/user-not-found': 'アカウントが見つかりません',
    'auth/wrong-password': 'パスワードが正しくありません',
    'auth/too-many-requests': 'リクエストが多すぎます。しばらく待ってから再試行してください',
    'auth/network-request-failed': 'ネットワークエラーが発生しました',
  };

  return errorMessages[errorCode] || 'エラーが発生しました';
};
