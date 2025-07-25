import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Replit uses env vars automatically
  });
}

export const firebaseAdmin = admin;
