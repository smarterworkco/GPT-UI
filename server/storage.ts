import { 
  users, businesses, documents, feedbackRequests, chatSessions, chatMessages,
  type User, type InsertUser, type Business, type InsertBusiness,
  type Document, type InsertDocument, type FeedbackRequest, type InsertFeedbackRequest,
  type ChatSession, type InsertChatSession, type ChatMessage, type InsertChatMessage
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Business
  getBusiness(userId: number): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness & { userId: number }): Promise<Business>;
  updateBusiness(id: number, business: Partial<InsertBusiness>): Promise<Business | undefined>;

  // Documents
  getDocuments(businessId: number): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(document: InsertDocument & { businessId: number }): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;

  // Feedback
  getFeedbackRequests(businessId: number): Promise<FeedbackRequest[]>;
  createFeedbackRequest(request: InsertFeedbackRequest & { businessId: number }): Promise<FeedbackRequest>;

  // Chat
  getChatSessions(businessId: number): Promise<ChatSession[]>;
  createChatSession(session: InsertChatSession & { businessId: number }): Promise<ChatSession>;
  getChatMessages(sessionId: number): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;

  // Analytics
  getBusinessMetrics(businessId: number): Promise<{
    totalDocuments: number;
    recentUpdates: number;
    aiInteractions: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private businesses: Map<number, Business> = new Map();
  private documents: Map<number, Document> = new Map();
  private feedbackRequests: Map<number, FeedbackRequest> = new Map();
  private chatSessions: Map<number, ChatSession> = new Map();
  private chatMessages: Map<number, ChatMessage> = new Map();
  
  private currentUserId = 1;
  private currentBusinessId = 1;
  private currentDocumentId = 1;
  private currentFeedbackId = 1;
  private currentSessionId = 1;
  private currentMessageId = 1;

  constructor() {
    // Initialize with demo data
    this.initializeDemoData();
  }

  private initializeDemoData() {
    // Create demo user
    const demoUser: User = {
      id: 1,
      username: "brad",
      email: "brad@businesssystems.com",
      password: "demo123"
    };
    this.users.set(1, demoUser);

    // Create demo business
    const demoBusiness: Business = {
      id: 1,
      name: "Demo Business Inc",
      description: "A sample business to demonstrate the BusinessAI Hub platform capabilities",
      industry: "professional-services",
      logoUrl: null,
      primaryColor: "#4F46E5",
      accentColor: "#F59E0B",
      userId: 1
    };
    this.businesses.set(1, demoBusiness);

    // Create demo documents
    const demoDocuments: Document[] = [
      {
        id: 1,
        title: "Employee Handbook 2024",
        description: "Comprehensive guide covering company policies, procedures, and expectations for all employees",
        category: "handbook",
        status: "approved",
        fileUrl: "/documents/employee-handbook-2024.pdf",
        tags: ["hr", "policies", "procedures"],
        businessId: 1,
        createdAt: new Date("2025-07-24"),
        updatedAt: new Date("2025-07-24")
      },
      {
        id: 2,
        title: "Customer Service SOP",
        description: "Standard operating procedures for handling customer inquiries, complaints, and service requests",
        category: "sop",
        status: "review",
        fileUrl: "/documents/customer-service-sop.pdf",
        tags: ["customer-service", "procedures"],
        businessId: 1,
        createdAt: new Date("2025-07-24"),
        updatedAt: new Date("2025-07-24")
      },
      {
        id: 3,
        title: "Data Privacy Policy",
        description: "Policy outlining how we collect, use, and protect customer and employee data in compliance with regulations",
        category: "policy",
        status: "approved",
        fileUrl: "/documents/data-privacy-policy.pdf",
        tags: ["privacy", "compliance", "legal"],
        businessId: 1,
        createdAt: new Date("2025-07-24"),
        updatedAt: new Date("2025-07-24")
      },
      {
        id: 4,
        title: "Q1 Marketing Campaign",
        description: "Marketing materials and campaign strategy for the first quarter product launch",
        category: "marketing",
        status: "draft",
        fileUrl: "/documents/q1-marketing-campaign.pdf",
        tags: ["marketing", "campaign", "q1"],
        businessId: 1,
        createdAt: new Date("2025-07-24"),
        updatedAt: new Date("2025-07-24")
      }
    ];

    demoDocuments.forEach(doc => this.documents.set(doc.id, doc));
    this.currentUserId = 2;
    this.currentBusinessId = 2;
    this.currentDocumentId = 5;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = { ...insertUser, id: this.currentUserId++ };
    this.users.set(user.id, user);
    return user;
  }

  // Business methods
  async getBusiness(userId: number): Promise<Business | undefined> {
    return Array.from(this.businesses.values()).find(business => business.userId === userId);
  }

  async createBusiness(business: InsertBusiness & { userId: number }): Promise<Business> {
    const newBusiness: Business = { 
      ...business, 
      id: this.currentBusinessId++,
      description: business.description || null,
      industry: business.industry || null,
      logoUrl: business.logoUrl || null,
      primaryColor: business.primaryColor || "#4F46E5",
      accentColor: business.accentColor || "#F59E0B"
    };
    this.businesses.set(newBusiness.id, newBusiness);
    return newBusiness;
  }

  async updateBusiness(id: number, business: Partial<InsertBusiness>): Promise<Business | undefined> {
    const existing = this.businesses.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...business };
    this.businesses.set(id, updated);
    return updated;
  }

  // Document methods
  async getDocuments(businessId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(doc => doc.businessId === businessId);
  }

  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }

  async createDocument(document: InsertDocument & { businessId: number }): Promise<Document> {
    const newDocument: Document = {
      ...document,
      id: this.currentDocumentId++,
      description: document.description || null,
      fileUrl: document.fileUrl || null,
      tags: document.tags || null,
      status: document.status || "draft",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.documents.set(newDocument.id, newDocument);
    return newDocument;
  }

  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined> {
    const existing = this.documents.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...document, updatedAt: new Date() };
    this.documents.set(id, updated);
    return updated;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  // Feedback methods
  async getFeedbackRequests(businessId: number): Promise<FeedbackRequest[]> {
    return Array.from(this.feedbackRequests.values()).filter(req => req.businessId === businessId);
  }

  async createFeedbackRequest(request: InsertFeedbackRequest & { businessId: number }): Promise<FeedbackRequest> {
    const newRequest: FeedbackRequest = {
      ...request,
      id: this.currentFeedbackId++,
      status: "pending",
      createdAt: new Date()
    };
    this.feedbackRequests.set(newRequest.id, newRequest);
    return newRequest;
  }

  // Chat methods
  async getChatSessions(businessId: number): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values()).filter(session => session.businessId === businessId);
  }

  async createChatSession(session: InsertChatSession & { businessId: number }): Promise<ChatSession> {
    const newSession: ChatSession = {
      ...session,
      id: this.currentSessionId++,
      createdAt: new Date()
    };
    this.chatSessions.set(newSession.id, newSession);
    return newSession;
  }

  async getChatMessages(sessionId: number): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).filter(msg => msg.sessionId === sessionId);
  }

  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      ...message,
      id: this.currentMessageId++,
      createdAt: new Date()
    };
    this.chatMessages.set(newMessage.id, newMessage);
    return newMessage;
  }

  // Analytics methods
  async getBusinessMetrics(businessId: number): Promise<{
    totalDocuments: number;
    recentUpdates: number;
    aiInteractions: number;
  }> {
    const documents = await this.getDocuments(businessId);
    const sessions = await this.getChatSessions(businessId);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentUpdates = documents.filter(doc => 
      doc.updatedAt && doc.updatedAt > thirtyDaysAgo
    ).length;
    
    let totalInteractions = 0;
    for (const session of sessions) {
      const messages = await this.getChatMessages(session.id);
      totalInteractions += messages.filter(msg => msg.role === 'user').length;
    }

    return {
      totalDocuments: documents.length,
      recentUpdates,
      aiInteractions: totalInteractions
    };
  }
}

export const storage = new MemStorage();
