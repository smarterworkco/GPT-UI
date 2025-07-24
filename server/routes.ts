import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBusinessSchema, insertDocumentSchema, insertFeedbackRequestSchema, insertChatSessionSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (hardcoded for demo)
  app.get("/api/user", async (req, res) => {
    const user = await storage.getUser(1); // Demo user
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  });

  // Business routes
  app.get("/api/business", async (req, res) => {
    const business = await storage.getBusiness(1); // Demo user ID
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    res.json(business);
  });

  app.put("/api/business", async (req, res) => {
    try {
      const validatedData = insertBusinessSchema.parse(req.body);
      const business = await storage.getBusiness(1);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      const updated = await storage.updateBusiness(business.id, validatedData);
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Documents routes
  app.get("/api/documents", async (req, res) => {
    const business = await storage.getBusiness(1);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    
    const documents = await storage.getDocuments(business.id);
    res.json(documents);
  });

  app.post("/api/documents", async (req, res) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      const business = await storage.getBusiness(1);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      const document = await storage.createDocument({
        ...validatedData,
        businessId: business.id
      });
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/documents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const document = await storage.getDocument(id);
    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.json(document);
  });

  app.put("/api/documents/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDocumentSchema.partial().parse(req.body);
      
      const updated = await storage.updateDocument(id, validatedData);
      if (!updated) {
        return res.status(404).json({ message: "Document not found" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/documents/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    const success = await storage.deleteDocument(id);
    if (!success) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(204).send();
  });

  // Feedback routes
  app.get("/api/feedback", async (req, res) => {
    const business = await storage.getBusiness(1);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    
    const feedback = await storage.getFeedbackRequests(business.id);
    res.json(feedback);
  });

  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackRequestSchema.parse(req.body);
      const business = await storage.getBusiness(1);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      const feedback = await storage.createFeedbackRequest({
        ...validatedData,
        businessId: business.id
      });
      res.status(201).json(feedback);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Chat routes
  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const validatedData = insertChatSessionSchema.parse(req.body);
      const business = await storage.getBusiness(1);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      
      const session = await storage.createChatSession({
        ...validatedData,
        businessId: business.id
      });
      res.status(201).json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/chat/sessions/:id/messages", async (req, res) => {
    const sessionId = parseInt(req.params.id);
    const messages = await storage.getChatMessages(sessionId);
    res.json(messages);
  });

  app.post("/api/chat/sessions/:id/messages", async (req, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const validatedData = insertChatMessageSchema.parse(req.body);
      
      const message = await storage.createChatMessage({
        ...validatedData,
        sessionId
      });
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/metrics", async (req, res) => {
    const business = await storage.getBusiness(1);
    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }
    
    const metrics = await storage.getBusinessMetrics(business.id);
    res.json(metrics);
  });

  const httpServer = createServer(app);
  return httpServer;
}
