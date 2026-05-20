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
  serverTimestamp,
  setDoc,
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
}: {
  user: User;
  fullName: string;
  username: string;
  role: AppRole;
}): UserProfileDocument {
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
    onboardingStep: 0,
    profileStatus: "pending",
    profileCompletenessPercent: 10,
    createdAt: now,
    updatedAt: now,
  };
}

async function assertUsernameAvailable(usernameValue: string) {
  const db = getDb();
  const key = usernameLower(usernameValue);

  try {
    const existing = await getDoc(doc(db, "usernames", key));
    if (existing.exists()) {
      throw new Error("Username is already taken.");
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Username is already taken.") {
      throw error;
    }
    console.warn("[Firebase] Could not verify username availability.", error);
  }
}

async function reserveUsername(uid: string, usernameValue: string) {
  const db = getDb();
  const cleanUsername = normalizeUsername(usernameValue);
  const key = usernameLower(cleanUsername);

  try {
    await setDoc(doc(db, "usernames", key), {
      uid,
      username: cleanUsername,
      usernameLower: key,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn("[Firebase] Could not reserve username.", error);
  }
}

async function ensureUserDocument(user: User, fallbackRole: AppRole = "logistician") {
  const db = getDb();
  const userRef = doc(db, "users", user.uid);
  const existing = await getDoc(userRef);

  if (existing.exists()) {
    return;
  }

  const username = fallbackUsername(user);
  await setDoc(
    userRef,
    buildUserDocument({
      user,
      fullName: user.displayName ?? username,
      username,
      role: fallbackRole,
    }),
  );
  await reserveUsername(user.uid, username);
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
  await assertUsernameAvailable(cleanUsername);

  const credential = await createUserWithEmailAndPassword(
    getFirebaseAuth(),
    email,
    password,
  );

  try {
    const db = getDb();
    await setDoc(
      doc(db, "users", credential.user.uid),
      buildUserDocument({
        user: credential.user,
        fullName,
        username: cleanUsername,
        role: normalizedRole,
      }),
    );
    await reserveUsername(credential.user.uid, cleanUsername);
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

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  const credential = await signInWithPopup(getFirebaseAuth(), provider);
  await ensureUserDocument(credential.user);
  return credential.user;
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
