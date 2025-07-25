// client/src/components/FeedbackForm.tsx
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/useAuth";

export default function FeedbackForm() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setStatus("submitting");

    try {
      await addDoc(collection(db, "feedback"), {
        message,
        userId: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
      });
      setMessage("");
      setStatus("success");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded max-w-xl bg-white shadow"
    >
      <h2 className="text-lg font-bold mb-2">Submit Feedback</h2>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="What do you want to share?"
        className="w-full p-2 border rounded mb-2"
        rows={4}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Submitting..." : "Submit Feedback"}
      </button>
      {status === "success" && (
        <p className="text-green-600 mt-2">Thank you! Feedback submitted.</p>
      )}
      {status === "error" && (
        <p className="text-red-600 mt-2">
          There was an error. Please try again.
        </p>
      )}
    </form>
  );
}
