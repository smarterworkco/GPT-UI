import { useMutation } from "@tanstack/react-query";

export function useAskAgent() {
  return useMutation({
    mutationFn: async (prompt: string) => {
      const res = await fetch("/api/a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to get response from agent");
      }

      const data = await res.json();
      return data.result;
    },
  });
}
