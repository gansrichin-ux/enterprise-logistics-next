import { getFirestore } from "firebase/firestore";
import { app, getFirebaseApp } from "./client";

export const db = app ? getFirestore(app) : null;

export function getDb() {
  return db ?? getFirestore(getFirebaseApp());
}

