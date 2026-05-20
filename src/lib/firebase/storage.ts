import { getStorage } from "firebase/storage";
import { app, getFirebaseApp } from "./client";

export const storage = app ? getStorage(app) : null;

export function getFirebaseStorage() {
  return storage ?? getStorage(getFirebaseApp());
}

