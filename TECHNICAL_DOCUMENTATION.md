# Task Manager Application - Technical Documentation

## Table of Contents
1. [High-Level Overview](#high-level-overview)
2. [Tech Stack Breakdown](#tech-stack-breakdown)
3. [Architecture Explanation](#architecture-explanation)
4. [Key Components](#key-components)
5. [Data Handling](#data-handling)
6. [Authentication & Authorization](#authentication--authorization)
7. [Styling](#styling)
8. [API & External Services](#api--external-services)
9. [Build & Deployment](#build--deployment)
10. [Development Workflow](#development-workflow)

---

## High-Level Overview

### What the App Does
TaskFlow is a modern, full-stack task management web application that allows users to:
- Create, update, and delete tasks with priorities and due dates
- Organize tasks by status (pending, in-progress, completed)
- Authenticate using email/password or OAuth (Google/GitHub)
- Manage user profiles with avatar uploads
- Filter and search tasks
- Get real-time feedback through notifications

### Purpose
The application serves as a comprehensive task management solution that emphasizes:
- **Simplicity**: Clean, minimalist interface focused on productivity
- **Flexibility**: Multiple authentication options and task organization methods
- **Scalability**: Modern tech stack that can handle growing user bases
- **Security**: JWT-based authentication with secure password handling

### Main Features
- **Task Management**: CRUD operations with priority levels (low, medium, high)
- **User Authentication**: Multiple login options (email/password, Google OAuth, GitHub OAuth)
- **Profile Management**: User profiles with bio, phone, and avatar upload
- **Real-time Updates**: Context-based state management with live data synchronization
- **Responsive Design**: Mobile-first design using Tailwind CSS
- **Data Persistence**: MongoDB integration with Mongoose ODM

---

## Tech Stack Breakdown

### Frontend Framework
- **Next.js 15.4.2** with App Router
  - **Why**: Provides server-side rendering, file-based routing, and API routes in one framework
  - **Features Used**: App Router, API routes, middleware, static generation

### Core Libraries
- **React 19.1.0** with TypeScript
  - **Why**: Type safety, component-based architecture, excellent ecosystem
  - **Features Used**: Hooks, Context API, functional components

### UI Framework & Styling
- **Tailwind CSS 4.1.11**
  - **Why**: Utility-first CSS framework for rapid UI development
  - **Features**: Custom design system, responsive design, dark mode support
  
- **Radix UI Components**
  - **Why**: Unstyled, accessible UI primitives
  - **Components Used**: Dialog, Select, Avatar, Navigation Menu, Alert Dialog
  
- **Lucide React**
  - **Why**: Beautiful, customizable SVG icons
  - **Usage**: Consistent iconography throughout the app

### State Management
- **React Context API**
  - **Why**: Built-in React solution for global state management
  - **Implementation**: Custom TasksContext for task operations and user state

### Backend & Database
- **MongoDB with Mongoose 8.16.5**
  - **Why**: NoSQL database perfect for flexible document structure
  - **Features**: Schema validation, middleware, connection pooling

### Authentication
- **JWT (jsonwebtoken 9.0.2)**
  - **Why**: Stateless authentication, perfect for API-first architecture
  - **Implementation**: Custom auth system with token-based sessions

- **bcryptjs 3.0.2**
  - **Why**: Secure password hashing
  - **Usage**: Hash passwords before storing in database

### File Handling
- **Formidable 3.5.4**
  - **Why**: Handle multipart form data for file uploads
  - **Usage**: Avatar upload functionality

### Development Tools
- **TypeScript 5**
  - **Why**: Type safety, better IDE support, reduced runtime errors
  - **Implementation**: Strict typing throughout the application

- **ESLint**
  - **Why**: Code quality and consistency
  - **Configuration**: Next.js recommended rules

### UI Enhancements
- **Sonner 2.0.6**
  - **Why**: Beautiful toast notifications
  - **Usage**: User feedback for actions (success/error messages)

- **next-themes 0.4.6**
  - **Why**: Theme switching capability
  - **Implementation**: Light/dark mode support (configured but not actively used)

---

## Architecture Explanation

### File/Folder Structure

```
src/
├── app/                     # Next.js App Router
│   ├── (main)/             # Route group for authenticated pages
│   │   ├── Dashboard/      # Main task creation page
│   │   ├── tasks/          # Task listing and individual task pages
│   │   └── profile/        # User profile management
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── tasks/          # Task CRUD operations
│   │   └── user/           # User management endpoints
│   ├── auth/               # Authentication pages
│   └── landingPage/        # Public landing page
├── components/             # Reusable UI components
│   └── ui/                 # Shadcn/ui components
├── context/                # React Context providers
├── lib/                    # Utility functions and configurations
├── models/                 # MongoDB/Mongoose schemas
└── types/                  # TypeScript type definitions
```

### Backend Logic Location
- **API Routes**: Located in `src/app/api/` following Next.js App Router conventions
- **Database Models**: Mongoose schemas in `src/models/`
- **Utility Functions**: Database connection, auth helpers in `src/lib/`
- **Middleware**: Route protection and JWT verification in `middleware.ts`

### API Routes Structure
```
/api
├── auth/
│   ├── login/              # POST - User login
│   ├── signup/             # POST - User registration
│   ├── google/             # GET - Google OAuth
│   └── github/             # GET - GitHub OAuth
├── tasks/
│   ├── route.ts            # GET (fetch), POST (create)
│   └── [id]/route.ts       # GET, PUT, DELETE individual tasks
└── user/
    ├── profile/route.ts    # GET, PUT user profile
    └── avatar/route.ts     # POST avatar upload
```

### Data Flow
1. **Frontend Request** → Component/Page makes API call
2. **Authentication** → Middleware validates JWT token
3. **API Route** → Processes request, validates data
4. **Database** → Mongoose interacts with MongoDB
5. **Response** → Data flows back through the same path
6. **State Update** → Context updates, triggers re-render

---

## Key Components

### Core Pages

#### `src/app/page.tsx` - Landing Page
- **Purpose**: Marketing/welcome page for unauthenticated users
- **Features**: Hero section, feature highlights, call-to-action buttons
- **Interactions**: Links to authentication pages

#### `src/app/(main)/Dashboard/page.tsx` - Dashboard
- **Purpose**: Main task creation interface
- **Components Used**: TaskForm
- **Functionality**: Primary entry point for authenticated users

#### `src/app/(main)/tasks/page.tsx` - Task List
- **Purpose**: Display and manage all user tasks
- **Components Used**: TasksList, TaskItem
- **Features**: Filtering, searching, bulk operations

#### `src/app/auth/login/page.tsx` & `src/app/auth/signup/page.tsx`
- **Purpose**: User authentication
- **Features**: Form validation, OAuth integration, error handling

### Core Components

#### `src/components/TaskForm.tsx`
- **Purpose**: Create new tasks
- **Features**: 
  - Form validation
  - Priority selection
  - Due date picker
  - Real-time feedback via toast notifications
- **State Management**: Integrates with TasksContext

#### `src/components/TasksList.tsx`
- **Purpose**: Display tasks in organized format
- **Features**: 
  - Status-based filtering
  - Priority indicators
  - Bulk selection
  - Search functionality

#### `src/components/TaskItem.tsx`
- **Purpose**: Individual task display and quick actions
- **Features**: 
  - Status toggle
  - Priority badges
  - Due date indicators
  - Quick edit/delete actions

#### `src/components/Nav.tsx`
- **Purpose**: Main navigation component
- **Features**: 
  - Logo/branding
  - Navigation links
  - Responsive design
- **Integration**: Uses Radix UI Navigation Menu

### Context Provider

#### `src/context/TasksContexts.tsx`
- **Purpose**: Global state management for tasks and user data
- **Features**:
  - Task CRUD operations
  - Authentication state
  - Loading states
  - Error handling
  - Token management
  - Event-driven updates

---

## Data Handling

### Database Schema

#### User Schema (`src/models/User.ts`)
```typescript
{
  name: string,           // Required, max 50 chars
  email: string,          // Required, unique, validated format
  password?: string,      // Optional for OAuth users, min 6 chars
  bio?: string,          // Optional, max 500 chars
  phone?: string,        // Optional, validated format
  avatar?: string,       // Optional, file path
  provider?: string,     // OAuth provider
  providerId?: string,   // OAuth provider ID
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-generated
}
```

#### Task Schema (`src/models/Task.ts`)
```typescript
{
  title: string,                           // Required, max 100 chars
  description?: string,                    // Optional, max 500 chars
  status: 'pending'|'in-progress'|'completed', // Default: 'pending'
  priority: 'low'|'medium'|'high',        // Default: 'medium'
  dueDate?: Date,                         // Optional
  userId: ObjectId,                       // Required, references User
  createdAt: Date,                        // Auto-generated
  updatedAt: Date                         // Auto-generated
}
```

### Data Fetching Strategy
- **Client-Side**: React Context with useEffect hooks for real-time data
- **Server-Side**: API routes handle database operations
- **Caching**: Global state in React Context prevents unnecessary API calls
- **Optimistic Updates**: UI updates immediately, reverts on API failure

### Database Connection (`src/lib/mongodb.ts`)
- **Connection Pooling**: Cached connection prevents multiple database connections
- **Global Variable**: Uses Next.js global object for connection persistence
- **Error Handling**: Graceful fallbacks and error reporting

### API Data Transformation
```typescript
// Database format (Mongoose)
{
  _id: ObjectId,
  status: 'pending'|'in-progress'|'completed'
}

// Frontend format (React)
{
  id: string,
  completed: boolean
}
```

### State Synchronization
- **Event-Driven**: Custom events for auth state changes
- **Storage Events**: Listens for localStorage changes across tabs
- **Auto-Refresh**: Periodic updates and manual refresh triggers

---

## Authentication & Authorization

### Authentication Flow

#### Email/Password Authentication
1. **Registration** (`/api/auth/signup`)
   - Password hashing with bcryptjs (10 salt rounds)
   - Email validation and uniqueness check
   - JWT token generation and cookie setting

2. **Login** (`/api/auth/login`)
   - Credential verification
   - Password comparison using bcryptjs
   - JWT token with 7-day expiration

#### OAuth Authentication (Google/GitHub)
1. **OAuth Redirect** (`/api/auth/google`, `/api/auth/github`)
   - External provider authentication
   - User data retrieval
   - Account creation or linking
   - JWT token generation

### JWT Token Management

#### Token Structure
```typescript
{
  userId: string,        // MongoDB ObjectId
  email: string,         // User email
  name: string,         // User display name
  exp: number,          // Expiration timestamp
  iat: number           // Issued at timestamp
}
```

#### Storage Strategy
- **HTTP-Only Cookie**: Server-side security (primary)
- **localStorage**: Client-side access (secondary)
- **Dual Storage**: Compatibility and security balance

#### Token Verification (`middleware.ts`)
```typescript
// Middleware protects routes: /tasks/*, /profile/*
export const config = {
  matcher: ["/tasks/:path*", "/profile/:path*"],
};
```

### Authorization Levels
- **Public Routes**: Landing page, auth pages
- **Protected Routes**: Dashboard, tasks, profile
- **API Protection**: JWT verification on all protected endpoints
- **User Isolation**: Tasks are user-specific via userId in queries

### Security Features
- **Password Hashing**: bcryptjs with salt rounds
- **JWT Secret**: Environment variable for token signing
- **Route Protection**: Middleware-based route guards
- **CORS**: Next.js default security headers
- **Input Validation**: Server-side validation for all inputs

---

## Styling

### Tailwind CSS Implementation

#### Design System
```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      background: "hsl(var(--background))",
      foreground: "hsl(var(--foreground))",
      primary: "hsl(var(--primary))",
      // CSS custom properties for theming
    }
  }
}
```

#### Utility Classes
- **Layout**: Flexbox, Grid, Container queries
- **Typography**: Font families (Geist Sans, Geist Mono)
- **Spacing**: Consistent padding/margin scale
- **Colors**: HSL-based color system
- **Responsive**: Mobile-first breakpoints

### Component Library (Radix UI + Shadcn/ui)

#### UI Components
- **Card**: Task containers, forms
- **Button**: Various variants and sizes
- **Input/Textarea**: Form controls with validation states
- **Select**: Dropdown menus for priority, status
- **Dialog**: Modals for confirmations, task details
- **Avatar**: User profile images with fallbacks
- **Badge**: Priority indicators, status tags

#### Accessibility Features
- **Keyboard Navigation**: Full keyboard support
- **Screen Reader**: ARIA labels and descriptions
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG compliant color combinations

### Responsive Design
- **Mobile-First**: Base styles target mobile devices
- **Breakpoints**: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- **Flexible Layouts**: CSS Grid and Flexbox for adaptive layouts
- **Touch-Friendly**: Adequate touch targets (44px minimum)

### Theming Support
- **CSS Custom Properties**: Dynamic color switching
- **next-themes**: Theme persistence and system preference detection
- **Component Variants**: Theme-aware component styling

---

## API & External Services

### Internal API Architecture

#### RESTful Design
```
GET    /api/tasks           # Fetch all user tasks
POST   /api/tasks           # Create new task
GET    /api/tasks/[id]      # Fetch specific task
PUT    /api/tasks/[id]      # Update specific task
DELETE /api/tasks/[id]      # Delete specific task
```

#### Request/Response Format
```typescript
// Request Headers
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}

// Success Response
{
  "success": true,
  "data": {...},
  "pagination": {...}    // For list endpoints
}

// Error Response
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"   // Optional
}
```

#### Pagination & Filtering
```typescript
// Query Parameters
?page=1&limit=50&status=pending&priority=high&search=task+name&sortBy=createdAt&sortOrder=desc
```

### External OAuth Services

#### Google OAuth Integration
- **Scope**: Profile information, email
- **Callback**: `/api/auth/google`
- **User Data**: Name, email, profile picture
- **Setup**: Google Cloud Console configuration required

#### GitHub OAuth Integration
- **Scope**: User profile, email
- **Callback**: `/api/auth/github`
- **User Data**: Username, email, avatar
- **Setup**: GitHub Developer Settings configuration required

### File Upload Service
- **Avatar Upload**: `/api/user/avatar`
- **Storage**: Local filesystem (`public/uploads/avatars/`)
- **Validation**: File type, size limits
- **Processing**: Image optimization and naming

### Error Handling Strategy
- **HTTP Status Codes**: Proper status codes for different scenarios
- **Error Messages**: User-friendly error descriptions
- **Logging**: Server-side error logging for debugging
- **Retry Logic**: Client-side retry for transient failures

---

## Build & Deployment

### Build Process

#### Development Build
```bash
npm run dev
# Uses Next.js development server with:
# - Hot reloading
# - Source maps
# - Detailed error messages
# - Turbopack (experimental bundler)
```

#### Production Build
```bash
npm run build
# Creates optimized production build with:
# - Code splitting
# - Minification
# - Image optimization
# - Static generation
```

#### Build Optimizations
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Removes unused code
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Google Fonts optimization
- **Bundle Analysis**: Built-in bundle analyzer

### Deployment Strategy

#### Vercel (Recommended)
1. **Automatic Deployment**: Git-based deployments
2. **Environment Variables**: Secure environment variable management
3. **Domain Management**: Custom domain configuration
4. **Analytics**: Built-in performance monitoring
5. **Preview Deployments**: Branch-based preview URLs

#### Alternative Platforms
- **Netlify**: Similar features to Vercel
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment
- **Traditional Hosting**: VPS with Node.js

#### Environment Configuration
```bash
# Production Environment Variables
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXTAUTH_URL=https://yourdomain.com
```

### Performance Optimizations
- **Server-Side Rendering**: Initial page load optimization
- **Static Generation**: Pre-built pages where possible
- **API Route Optimization**: Efficient database queries
- **Caching Strategy**: Browser and CDN caching
- **Compression**: Gzip/Brotli compression

---

## Development Workflow

### Local Development Setup

#### Prerequisites
- Node.js 18+ (recommended: use nvm)
- npm, yarn, or pnpm
- MongoDB (local installation or MongoDB Atlas)
- Git

#### Installation Steps
```bash
# 1. Clone the repository
git clone <repository-url>
cd task-manager-nextjs

# 2. Install dependencies
npm install

# 3. Environment setup
cp .env.local.example .env.local
# Edit .env.local with your configuration

# 4. Start development server
npm run dev
```

#### Environment Variables Setup
```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret
NEXTAUTH_URL=http://localhost:3000
```

### Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

### Database Setup

#### Local MongoDB
```bash
# Install MongoDB locally or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in .env.local
```

#### Database Initialization
- Database and collections are created automatically
- Mongoose handles schema enforcement
- No manual database setup required

### OAuth Setup Process

#### Google OAuth
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:3000/api/auth/google`
6. Copy credentials to `.env.local`

#### GitHub OAuth
1. Visit [GitHub Developer Settings](https://github.com/settings/developers)
2. Create new OAuth App
3. Set callback URL: `http://localhost:3000/api/auth/github`
4. Copy credentials to `.env.local`

### Testing Strategy

#### Manual Testing
- **User Flows**: Registration, login, task management
- **Cross-Browser**: Chrome, Firefox, Safari, Edge
- **Responsive**: Mobile, tablet, desktop viewports
- **Accessibility**: Keyboard navigation, screen readers

#### Automated Testing (Future Implementation)
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API route testing
- **E2E Tests**: Playwright or Cypress
- **Performance Tests**: Lighthouse CI

### Code Quality

#### Linting Configuration
```javascript
// eslint.config.mjs
export default {
  extends: ["next/core-web-vitals"],
  rules: {
    // Custom rules
  }
}
```

#### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    // Path mapping for clean imports
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Development Best Practices
- **Component Structure**: Keep components small and focused
- **Type Safety**: Use TypeScript for all new code
- **Error Handling**: Implement proper error boundaries
- **Performance**: Monitor bundle size and Core Web Vitals
- **Security**: Regular dependency updates, security audits
- **Documentation**: Comment complex logic, update README

### Debugging Tools
- **Next.js DevTools**: Built-in debugging capabilities
- **React DevTools**: Component inspection and profiling
- **Network Tab**: API request/response monitoring
- **Database Tools**: MongoDB Compass for database inspection
- **VS Code Extensions**: ES7 snippets, Tailwind CSS IntelliSense

---

## Conclusion

This Task Manager application demonstrates modern full-stack development practices using Next.js, React, TypeScript, and MongoDB. The architecture emphasizes:

- **Developer Experience**: Type safety, hot reloading, clear structure
- **User Experience**: Responsive design, real-time updates, accessibility
- **Scalability**: Modular architecture, efficient data handling
- **Security**: JWT authentication, input validation, secure practices
- **Maintainability**: Clean code, documentation, testing foundation

The application serves as a solid foundation for task management features and can be extended with additional functionality like team collaboration, task categories, file attachments, and advanced reporting.
