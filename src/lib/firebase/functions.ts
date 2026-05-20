import { getFunctions } from "firebase/functions";
import { app, getFirebaseApp } from "./client";

export const functions = app ? getFunctions(app) : null;

export function getFirebaseFunctions() {
  return functions ?? getFunctions(getFirebaseApp());
}

