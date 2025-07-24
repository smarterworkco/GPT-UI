# Business AI Assistant Platform

## Overview

This is a full-stack web application built as a business AI assistant platform. It provides multiple specialized AI agents to help businesses with various tasks including general business advice, standard operating procedures (SOPs), compliance management, and social media management. The application includes document management, feedback systems, and comprehensive business analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Radix UI primitives with shadcn/ui components
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with development hot module replacement

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Storage**: PostgreSQL-based sessions (connect-pg-simple)
- **Development**: Memory-based storage fallback for development

### Key Components

#### AI Agent System
The application features four specialized AI agents:
- **General Business AI**: Strategic planning and operational guidance
- **SOP Assistant**: Standard operating procedure creation and optimization
- **Regulatory Compliance**: Industry regulation and policy management
- **Social Media Manager**: Content creation and social media strategy

Each agent has distinct styling, capabilities, and conversation contexts maintained through chat sessions.

#### Document Management
- Multi-category document organization (handbook, SOP, policy, marketing, general)
- Document status tracking (draft, review, approved)
- File upload and storage capabilities
- Tag-based organization system
- Search and filtering functionality

#### Chat System
- Modal-based chat interface
- Session-based conversation management
- Agent-specific context preservation
- Real-time message exchange
- Chat history persistence

#### Business Configuration
- Customizable business branding (colors, logo)
- Industry-specific settings
- Theme customization with preset color schemes
- Business profile management

## Data Flow

1. **Authentication**: Currently uses hardcoded demo user (ID: 1)
2. **Business Context**: Single business per user model
3. **Document Flow**: Business → Documents → Categories/Tags
4. **Chat Flow**: Business → Chat Sessions → Messages (agent-specific)
5. **Feedback Flow**: Business → Feedback Requests → Status tracking

## External Dependencies

### Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Drizzle Kit**: Database migrations and schema management

### UI & Styling
- **Radix UI**: Accessible primitive components
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **Vite**: Frontend build tool and development server
- **ESBuild**: Backend bundling for production
- **TSX**: TypeScript execution for development

### Form Management
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **@hookform/resolvers**: Zod integration with React Hook Form

## Deployment Strategy

### Development
- Frontend: Vite dev server with HMR
- Backend: TSX for TypeScript execution
- Database: Neon Database with connection pooling
- Session handling: In-memory fallback for development

### Production
- Frontend: Static build output to `dist/public`
- Backend: ESBuild bundle to `dist/index.js`
- Database: Neon Database with environment-based configuration
- Session storage: PostgreSQL-backed sessions

### Environment Configuration
- `DATABASE_URL`: PostgreSQL connection string (required)
- `NODE_ENV`: Environment specification (development/production)
- Development includes Replit-specific tooling and error overlays

The application follows a monorepo structure with shared TypeScript definitions between client and server, enabling type-safe API communication and shared schema validation.