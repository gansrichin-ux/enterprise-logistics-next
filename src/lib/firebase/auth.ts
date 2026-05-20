import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type Auth,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { getFirebaseApp, isFirebaseConfigured } from "./client";
import { getDb } from "./firestore";
import { normalizeRole, type AppRole } from "@/lib/roles";

type RegisterWithEmailInput = {
  email: string;
  password: string;
  fullName: string;
  username: string;
  role: string;
};

type UserDocumentOptions = {
  profileStatus?: string;
  onboardingStep?: number;
};

export type GoogleSignInResult = {
  user: User;
  needsOnboarding: boolean;
};

export type UserProfileDocument = {
  uid: string;
  email: string;
  role: AppRole;
  roles: AppRole[];
  username: string;
  usernameLower: string;
  name: string;
  preferredLanguage: string;
  ratingCount: number;
  ratingSum: number;
  emailCodeVerified: boolean;
  emailVerificationSkipped: boolean;
  onboardingCompleted: boolean;
  onboardingStep: number;
  profileStatus: string;
  profileCompletenessPercent: number;
  createdAt: unknown;
  updatedAt: unknown;
};

function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

function normalizeUsername(username: string) {
  const cleaned = username.trim().replace(/\s+/g, "_");
  if (!cleaned) {
    throw new Error("Username is required.");
  }
  return cleaned;
}

function usernameLower(username: string) {
  return normalizeUsername(username).toLocaleLowerCase("en-US");
}

function fallbackUsername(user: User) {
  const source = user.displayName || user.email?.split("@")[0] || "user";
  const base = source
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `${base || "user"}_${user.uid.slice(0, 6)}`;
}

function buildUserDocument({
  user,
  fullName,
  username,
  role,
  profileStatus = "pending",
  onboardingStep = 0,
}: {
  user: User;
  fullName: string;
  username: string;
  role: AppRole;
} & UserDocumentOptions): UserProfileDocument {
  const now = serverTimestamp();
  const cleanUsername = normalizeUsername(username);

  return {
    uid: user.uid,
    email: user.email ?? "",
    role,
    roles: [role],
    username: cleanUsername,
    usernameLower: usernameLower(cleanUsername),
    name: fullName.trim() || user.displayName || cleanUsername,
    preferredLanguage: "en",
    ratingCount: 0,
    ratingSum: 0,
    emailCodeVerified: false,
    emailVerificationSkipped: false,
    onboardingCompleted: false,
    onboardingStep,
    profileStatus,
    profileCompletenessPercent: 10,
    createdAt: now,
    updatedAt: now,
  };
}

async function createUserProfileWithUsername({
  user,
  fullName,
  username,
  role,
  options,
}: {
  user: User;
  fullName: string;
  username: string;
  role: AppRole;
  options?: UserDocumentOptions;
}) {
  const db = getDb();
  const cleanUsername = normalizeUsername(username);
  const key = usernameLower(cleanUsername);
  const userRef = doc(db, "users", user.uid);
  const usernameRef = doc(db, "usernames", key);

  await runTransaction(db, async (transaction) => {
    const existing = await transaction.get(usernameRef);
    if (existing.exists()) {
      throw new Error("Username is already taken.");
    }

    transaction.set(
      userRef,
      buildUserDocument({
        user,
        fullName,
        username: cleanUsername,
        role,
        ...options,
      }),
    );
    transaction.set(usernameRef, { uid: user.uid });
  });
}

async function ensureGoogleUserDocument(user: User): Promise<boolean> {
  const db = getDb();
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    const data = existing.data();
    return data?.profileStatus === "needs_role" || !data?.role;
  }

  const username = fallbackUsername(user);
  await createUserProfileWithUsername({
    user,
    fullName: user.displayName ?? username,
    username,
    role: "logistician",
    options: {
      profileStatus: "needs_role",
      onboardingStep: 1,
    },
  });
  return true;
}

export async function signInWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );
  return credential.user;
}

export async function registerWithEmail({
  email,
  password,
  fullName,
  username,
  role,
}: RegisterWithEmailInput) {
  const cleanUsername = normalizeUsername(username);
  const normalizedRole = normalizeRole(role);

  const credential = await createUserWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );

  try {
    await createUserProfileWithUsername({
      user: credential.user,
      fullName,
      username: cleanUsername,
      role: normalizedRole,
    });
  } catch (error) {
    try {
      await deleteUser(credential.user);
    } catch (deleteError) {
      console.warn("[Firebase] Could not roll back auth user.", deleteError);
    }
    throw error;
  }

  return credential.user;
}

export async function signInWithGoogle(): Promise<GoogleSignInResult> {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(getFirebaseAuth(), provider);
  const needsOnboarding = await ensureGoogleUserDocument(credential.user);
  return { user: credential.user, needsOnboarding };
}

export async function logout() {
  await signOut(getFirebaseAuth());
}

export function observeAuthState(callback: (user: User | null) => void): Unsubscribe {
  if (!isFirebaseConfigured) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export function getCurrentUser() {
  if (!isFirebaseConfigured) {
    return null;
  }
  return getFirebaseAuth().currentUser;
}

export async function sendPasswordResetLink(email: string, redirectUrl?: string) {
  await sendPasswordResetEmail(
    getFirebaseAuth(),
    email,
    redirectUrl ? { url: redirectUrl } : undefined,
  );
}
