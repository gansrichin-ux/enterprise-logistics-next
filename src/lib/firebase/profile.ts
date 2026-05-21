import type { User } from "firebase/auth";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  query,
  where,
  type DocumentData,
} from "firebase/firestore";
import { getRoleLabel, normalizeRole, type AppRole } from "@/lib/roles";
import { getDb } from "./firestore";

export type UserProfile = {
  uid: string;
  email: string;
  role: AppRole | null;
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

export type CompanyProfile = {
  id: string;
  name: string;
  legalName: string;
  description: string;
  country: string;
  region: string;
  city: string;
  address: string;
  bin: string;
  phone: string;
  email: string;
  website: string;
  status: string;
  completenessPercent: number | null;
  createdAt: unknown;
  updatedAt: unknown;
};

export type ActivityLog = {
  id: string;
  title: string;
  description: string;
  createdAt: unknown;
};

export type AccountCounts = {
  cargoDocuments: number | null;
  siteNotifications: number | null;
};

export type AccountData = {
  user: User;
  profile: UserProfile | null;
  company: CompanyProfile | null;
  activityLogs: ActivityLog[];
  counts: AccountCounts;
};

type AccountDataOptions = {
  includeActivity?: boolean;
  includeCounts?: boolean;
};

const OWNER_FIELDS = ["uid", "userId", "ownerUid"] as const;

function stringField(data: DocumentData | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = data?.[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return "";
}

function numberField(data: DocumentData | null | undefined, keys: string[]) {
  for (const key of keys) {
    const value = data?.[key];
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }
  return null;
}

function boolField(data: DocumentData | null | undefined, key: string) {
  return typeof data?.[key] === "boolean" ? Boolean(data[key]) : false;
}

function toMillis(value: unknown) {
  if (!value) return 0;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") {
    return value.toDate().getTime();
  }
  return 0;
}

export function formatFirestoreDate(value: unknown) {
  const millis = toMillis(value);
  if (!millis) return "Дата не указана";
  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(millis));
}

export function getInitials(value: string | null | undefined) {
  const source = (value || "Jük Bar").trim();
  return source
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function getProfileStatusLabel(status: string | null | undefined) {
  switch (status) {
    case "active":
    case "completed":
    case "pending":
      return "Профиль активен";
    case "needs_role":
      return "Нужно выбрать роль";
    case "blocked":
      return "Профиль заблокирован";
    default:
      return "Профиль не заполнен";
  }
}

export function isProfileReady(profile: UserProfile | null) {
  return Boolean(profile?.role && profile.profileStatus !== "needs_role");
}

export function getProfileRoleLabel(profile: UserProfile | null) {
  return profile?.role ? getRoleLabel(profile.role) : "Роль не выбрана";
}

function mapUserProfile(user: User, data: DocumentData | null): UserProfile | null {
  if (!data) return null;
  const rawRole = typeof data.role === "string" && data.role ? data.role : "";
  const role = rawRole ? normalizeRole(rawRole) : null;
  const rawRoles = Array.isArray(data.roles) ? data.roles : role ? [role] : [];
  const roles = rawRoles.map((item) => normalizeRole(String(item)));

  return {
    uid: stringField(data, ["uid"]) || user.uid,
    email: stringField(data, ["email"]) || user.email || "",
    role,
    roles,
    username: stringField(data, ["username"]),
    usernameLower: stringField(data, ["usernameLower"]),
    name: stringField(data, ["name"]) || user.displayName || "",
    preferredLanguage: stringField(data, ["preferredLanguage"]) || "ru",
    ratingCount: numberField(data, ["ratingCount"]) ?? 0,
    ratingSum: numberField(data, ["ratingSum"]) ?? 0,
    emailCodeVerified: boolField(data, "emailCodeVerified"),
    emailVerificationSkipped: boolField(data, "emailVerificationSkipped"),
    onboardingCompleted: boolField(data, "onboardingCompleted"),
    onboardingStep: numberField(data, ["onboardingStep"]) ?? 0,
    profileStatus: stringField(data, ["profileStatus"]) || "not_completed",
    profileCompletenessPercent: numberField(data, ["profileCompletenessPercent"]) ?? 0,
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

function mapCompanyProfile(id: string, data: DocumentData): CompanyProfile {
  return {
    id,
    name: stringField(data, ["name", "companyName", "company_name"]),
    legalName: stringField(data, ["legalName", "legal_name"]),
    description: stringField(data, ["description", "companyDescription", "company_description"]),
    country: stringField(data, ["country"]),
    region: stringField(data, ["region"]),
    city: stringField(data, ["city"]),
    address: stringField(data, ["address", "registeredAddress", "registered_address"]),
    bin: stringField(data, ["bin", "taxId", "tax_id", "registrationNumber"]),
    phone: stringField(data, ["phone"]),
    email: stringField(data, ["email"]),
    website: stringField(data, ["website"]),
    status: stringField(data, ["status", "profileStatus", "verificationStatus"]) || "not_completed",
    completenessPercent: numberField(data, ["completenessPercent", "profileCompletenessPercent"]),
    createdAt: data.createdAt ?? null,
    updatedAt: data.updatedAt ?? null,
  };
}

function mapActivityLog(id: string, data: DocumentData): ActivityLog {
  return {
    id,
    title: stringField(data, ["title", "action", "event", "message"]) || "Событие",
    description: stringField(data, ["description", "details", "body"]),
    createdAt: data.createdAt ?? data.timestamp ?? null,
  };
}

export async function readUserProfile(user: User) {
  const snap = await getDoc(doc(getDb(), "users", user.uid));
  return mapUserProfile(user, snap.exists() ? snap.data() : null);
}

export async function readCompanyProfile(uid: string) {
  const db = getDb();
  const direct = await getDoc(doc(db, "companyProfiles", uid)).catch(() => null);
  if (direct?.exists()) {
    return mapCompanyProfile(direct.id, direct.data());
  }

  for (const ownerField of OWNER_FIELDS) {
    const result = await getDocs(
      query(collection(db, "companyProfiles"), where(ownerField, "==", uid), limit(1)),
    ).catch(() => null);
    const first = result?.docs[0];
    if (first) {
      return mapCompanyProfile(first.id, first.data());
    }
  }

  return null;
}

async function readOwnedCount(collectionName: string, uid: string) {
  const db = getDb();
  for (const ownerField of OWNER_FIELDS) {
    const result = await getCountFromServer(
      query(collection(db, collectionName), where(ownerField, "==", uid)),
    ).catch(() => null);
    if (result) {
      return result.data().count;
    }
  }
  return null;
}

export async function readActivityLogs(uid: string) {
  const db = getDb();
  for (const ownerField of OWNER_FIELDS) {
    const result = await getDocs(
      query(collection(db, "activityLogs"), where(ownerField, "==", uid), limit(6)),
    ).catch(() => null);
    if (result) {
      return result.docs
        .map((item) => mapActivityLog(item.id, item.data()))
        .sort((a, b) => toMillis(b.createdAt) - toMillis(a.createdAt));
    }
  }
  return [];
}

export async function readAccountData(user: User, options: AccountDataOptions = {}): Promise<AccountData> {
  const includeActivity = options.includeActivity ?? true;
  const includeCounts = options.includeCounts ?? true;

  const [profile, company, activityLogs, cargoDocuments, siteNotifications] = await Promise.all([
    readUserProfile(user).catch(() => null),
    readCompanyProfile(user.uid).catch(() => null),
    includeActivity ? readActivityLogs(user.uid).catch(() => []) : Promise.resolve([]),
    includeCounts ? readOwnedCount("cargoDocuments", user.uid).catch(() => null) : Promise.resolve(null),
    includeCounts ? readOwnedCount("siteNotifications", user.uid).catch(() => null) : Promise.resolve(null),
  ]);

  return {
    user,
    profile,
    company,
    activityLogs,
    counts: {
      cargoDocuments,
      siteNotifications,
    },
  };
}
