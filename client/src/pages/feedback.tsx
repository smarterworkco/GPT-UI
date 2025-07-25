import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MessageSquare, Plus, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { db } from "../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../lib/useAuth";

export default function FeedbackPage() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();

  const form = useForm({
    defaultValues: {
      type: "",
      title: "",
      description: "",
      priority: "medium",
    },
  });

  const { data: feedbackRequests = [] } = useQuery({
    queryKey: ["feedback"],
    queryFn: async () => {
      const snapshot = await collection(db, "feedback");
      // Replace with actual read logic if needed later
      return [];
    },
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data) => {
      if (!user) throw new Error("Must be logged in");
      return await addDoc(collection(db, "feedback"), {
        ...data,
        userId: user.uid,
        email: user.email,
        createdAt: serverTimestamp(),
        status: "open",
      });
    },
    onSuccess: () => {
      setShowForm(false);
      setShowSuccess(true);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
      toast({
        title: "Feedback submitted!",
        description: "Thank you for your feedback. We'll review it soon.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    submitFeedbackMutation.mutate(data);
  };

  const showFeedbackForm = () => {
    setShowForm(true);
    setShowSuccess(false);
  };

  const hideFeedbackForm = () => {
    setShowForm(false);
    form.reset();
  };

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Feedback & Requests
            </h1>
            <p className="text-gray-600 mt-2">
              Share your ideas and report issues to help us improve
            </p>
          </div>
          {!showForm && (
            <Button onClick={showFeedbackForm}>
              <Plus className="mr-2 h-4 w-4" /> New Request
            </Button>
          )}
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submit Feedback</CardTitle>
                <Button variant="ghost" size="icon" onClick={hideFeedbackForm}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div>
                  <Label htmlFor="type">Request Type</Label>
                  <Select
                    onValueChange={(value) => form.setValue("type", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feature">Feature Request</SelectItem>
                      <SelectItem value="bug">Bug Report</SelectItem>
                      <SelectItem value="improvement">Improvement</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    {...form.register("title")}
                    placeholder="Brief description..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    {...form.register("description")}
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label>Priority</Label>
                  <RadioGroup
                    defaultValue="medium"
                    onValueChange={(value) => form.setValue("priority", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low">Low</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high">High</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={hideFeedbackForm}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={submitFeedbackMutation.isPending}
                  >
                    {submitFeedbackMutation.isPending
                      ? "Submitting..."
                      : "Submit Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {showSuccess && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Request Submitted!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for your feedback. We'll review your request soon.
              </p>
              <Button onClick={showFeedbackForm}>Submit Another Request</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
