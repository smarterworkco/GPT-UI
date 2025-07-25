import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../lib/firebase-admin";

export async function verifyFirebaseToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid auth header" });
  }

  const idToken = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
}
