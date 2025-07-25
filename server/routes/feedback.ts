import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken";

import express from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken";

const router = express.Router();

// ✅ Protect GET /api/feedback
router.get("/", verifyFirebaseToken, async (req, res) => {
  const user = (req as any).user;
  console.log("User UID:", user.uid);

  // Your actual logic here, e.g. read from Firestore
  res.json([{ id: 1, title: "Example feedback" }]);
});

// ✅ Protect POST /api/feedback
router.post("/", verifyFirebaseToken, async (req, res) => {
  const user = (req as any).user;
  const data = req.body;

  // Example: store feedback in Firestore with user.uid attached
  res.status(201).json({ message: "Received", submittedBy: user.uid });
});

export default router;
