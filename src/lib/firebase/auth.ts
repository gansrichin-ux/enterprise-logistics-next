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
  onboardingCompleted?: boolean;
  profileCompletenessPercent?: number;
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

type CompleteProfileInput = {
  fullName: string;
  username: string;
  role: string;
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

function buildUserDocument({
  user,
  fullName,
  username,
  role,
  profileStatus = "pending",
  onboardingStep = 0,
  onboardingCompleted = false,
  profileCompletenessPercent = 10,
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
    onboardingCompleted,
    onboardingStep,
    profileStatus,
    profileCompletenessPercent,
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

export async function completeProfileWithRole({
  fullName,
  username,
  role,
}: CompleteProfileInput) {
  const auth = getFirebaseAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Сначала войдите в аккаунт.");
  }

  const db = getDb();
  const cleanUsername = normalizeUsername(username);
  const key = usernameLower(cleanUsername);
  const normalizedRole = normalizeRole(role);
  const userRef = doc(db, "users", user.uid);
  const usernameRef = doc(db, "usernames", key);

  await runTransaction(db, async (transaction) => {
    const existingUser = await transaction.get(userRef);

    if (!existingUser.exists()) {
      const existingUsername = await transaction.get(usernameRef);
      if (existingUsername.exists()) {
        throw new Error("Username is already taken.");
      }

      transaction.set(usernameRef, { uid: user.uid });
      transaction.set(
        userRef,
        buildUserDocument({
          user,
          fullName,
          username: cleanUsername,
          role: normalizedRole,
          profileStatus: "pending",
          onboardingStep: 1,
          onboardingCompleted: true,
          profileCompletenessPercent: 20,
        }),
      );
      return;
    }

    const data = existingUser.data();
    const existingRole = data?.role ? normalizeRole(data.role as string) : null;
    const existingUsernameLower = typeof data?.usernameLower === "string" ? data.usernameLower : "";

    if (!existingRole) {
      throw new Error("Existing profile has no role and cannot be completed without a Firestore rules migration.");
    }
    if (existingRole !== normalizedRole) {
      throw new Error("Role change for an existing profile requires a Firestore rules migration.");
    }
    if (existingUsernameLower && existingUsernameLower !== key) {
      throw new Error("Username change for an existing profile requires username reservation cleanup.");
    }
    if (!existingUsernameLower) {
      const existingUsername = await transaction.get(usernameRef);
      if (existingUsername.exists()) {
        throw new Error("Username is already taken.");
      }
      transaction.set(usernameRef, { uid: user.uid });
    }

    transaction.update(userRef, {
      username: cleanUsername,
      usernameLower: key,
      name: fullName.trim() || user.displayName || cleanUsername,
      onboardingCompleted: true,
      onboardingStep: 1,
      profileCompletenessPercent: Math.max(
        typeof data?.profileCompletenessPercent === "number" ? data.profileCompletenessPercent : 0,
        20,
      ),
      updatedAt: serverTimestamp(),
    });
  });
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

export function getPasswordResetErrorMessage(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";
  const message = error instanceof Error ? error.message : String(error);

  switch (code) {
    case "auth/invalid-email":
      return "Введите корректный email";
    case "auth/user-not-found":
      return "Пользователь с таким email не найден";
    case "auth/missing-email":
      return "Введите email";
    case "auth/unauthorized-continue-uri":
      return "Домен для восстановления пароля не разрешён в Firebase. Проверьте настройки проекта.";
    default:
      if (message.includes("Firebase is not configured")) {
        return "Firebase не настроен. Проверьте локальный .env.";
      }
      return "Не удалось отправить письмо для восстановления пароля. Попробуйте позже.";
  }
}

export function getAuthErrorMessage(error: unknown) {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: unknown }).code)
      : "";
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("Username is already taken")) {
    return "Этот username уже занят. Выберите другой.";
  }

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Неверный email или пароль.";
    case "auth/email-already-in-use":
      return "Аккаунт с таким email уже существует.";
    case "auth/weak-password":
      return "Пароль слишком простой. Используйте минимум 8 символов.";
    case "auth/invalid-email":
      return "Введите корректный email.";
    case "auth/popup-blocked":
      return "Браузер заблокировал окно Google. Разрешите всплывающие окна и попробуйте снова.";
    case "auth/popup-closed-by-user":
      return "Вход через Google был отменен.";
    case "auth/unauthorized-domain":
      return "Этот домен не разрешен в Firebase Auth.";
    default:
      if (message.includes("Firebase is not configured")) {
        return "Firebase не настроен. Проверьте локальный .env.";
      }
      if (message.includes("Firestore rules migration")) {
        return "Этот профиль нельзя завершить без отдельного плана Firebase rules.";
      }
      if (message.includes("username reservation cleanup")) {
        return "Для смены username нужен отдельный cleanup старой резервации.";
      }
      return message || "Не удалось выполнить действие. Попробуйте еще раз.";
  }
}
