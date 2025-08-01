# TaskFlow - Task Manager Learning Project

A simple task management app built while learning Next.js, TypeScript, and MongoDB. This project demonstrates basic CRUD operations, user authentication, and modern web development practices.

## What I Built

- Create, edit, and delete tasks with priorities and due dates
- User authentication (email/password + Google/GitHub login)
- User profiles with avatar upload
- Search and filter tasks
- Responsive design with Tailwind CSS

## Tech Stack I Used

- **Next.js 15** - React framework with App Router
- **TypeScript** - For type safety
- **MongoDB** - Database with Mongoose
- **Tailwind CSS** - For styling
- **shadcn/ui** - UI components

## How to Run Locally

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd task-manager-nextjs
   npm install
   ```

2. **Set up environment variables**
   Create `.env.local` with:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=any_random_string
   
   # Optional - for OAuth login
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000)

## What I Learned

- Next.js App Router and server components
- MongoDB integration with Mongoose
- JWT authentication and OAuth flows
- File upload handling (for avatars)
- TypeScript in a full-stack application
- Responsive design with Tailwind CSS
- API route handling and error management

## Live Demo

🌐 **[View Live App](https://task-manager-app-sigma-green.vercel.app)**

---

*This is a learning project created to practice modern web development with Next.js and TypeScript.*


