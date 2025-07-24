import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { insertFeedbackRequestSchema, FeedbackRequest, InsertFeedbackRequest } from "@shared/schema";
import { MessageSquare, Plus, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type FeedbackForm = InsertFeedbackRequest;

export default function Feedback() {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: feedbackRequests = [] } = useQuery<FeedbackRequest[]>({
    queryKey: ["/api/feedback"]
  });

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(insertFeedbackRequestSchema),
    defaultValues: {
      type: "",
      title: "",
      description: "",
      priority: "medium"
    }
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: async (data: FeedbackForm) => {
      const response = await apiRequest("POST", "/api/feedback", data);
      return response.json() as Promise<FeedbackRequest>;
    },
    onSuccess: () => {
      setShowForm(false);
      setShowSuccess(true);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/feedback"] });
      toast({
        title: "Feedback submitted!",
        description: "Thank you for your feedback. We'll review it and get back to you soon."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmit = (data: FeedbackForm) => {
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

  if (feedbackRequests.length === 0 && !showForm && !showSuccess) {
    return (
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Feedback & Requests</h1>
            <p className="text-gray-600 mt-2">Share your ideas and report issues to help us improve</p>
          </div>

          {/* Empty State */}
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No requests yet</h3>
            <p className="text-gray-600 mb-8">Share your feedback and ideas to help us improve the platform</p>
            <Button onClick={showFeedbackForm}>
              <Plus className="mr-2 h-4 w-4" />
              Submit First Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feedback & Requests</h1>
            <p className="text-gray-600 mt-2">Share your ideas and report issues to help us improve</p>
          </div>
          {!showForm && (
            <Button onClick={showFeedbackForm}>
              <Plus className="mr-2 h-4 w-4" />
              New Request
            </Button>
          )}
        </div>

        {/* Feedback Form */}
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Label htmlFor="type">Request Type</Label>
                  <Select onValueChange={(value) => form.setValue("type", value)} required>
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
                    placeholder="Brief description of your request..."
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    {...form.register("description")}
                    placeholder="Please provide detailed information about your request..."
                    rows={6}
                    required
                  />
                </div>

                <div>
                  <Label>Priority</Label>
                  <RadioGroup
                    defaultValue="medium"
                    onValueChange={(value) => form.setValue("priority", value as "low" | "medium" | "high")}
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
                  <Button type="button" variant="outline" onClick={hideFeedbackForm} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={submitFeedbackMutation.isPending}>
                    {submitFeedbackMutation.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {showSuccess && (
          <Card className="mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Request Submitted!</h3>
              <p className="text-gray-600 mb-6">Thank you for your feedback. We'll review your request and get back to you soon.</p>
              <Button onClick={showFeedbackForm}>
                Submit Another Request
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Existing Feedback Requests */}
        {feedbackRequests.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Your Requests</h2>
            {feedbackRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{request.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                          {request.type}
                        </span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {request.priority}
                        </span>
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {request.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 ml-4">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
