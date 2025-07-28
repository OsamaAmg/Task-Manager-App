# TaskFlow - Modern Task Management Application

A full-stack task management web application built with Next.js, TypeScript, and MongoDB. TaskFlow provides a clean, intuitive interface for managing tasks with multiple authentication options and real-time updates.

## ✨ Features

- **📝 Task Management**: Create, update, delete, and organize tasks with priority levels
- **🔐 Multiple Authentication**: Email/password, Google OAuth, and GitHub OAuth
- **👤 User Profiles**: Customizable profiles with avatar upload support
- **🎨 Modern UI**: Clean, responsive design with dark/light theme support
- **🔄 Real-time Updates**: Live data synchronization across the application
- **📱 Mobile-First**: Fully responsive design for all devices
- **🔍 Search & Filter**: Advanced task filtering and search capabilities

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.4.2 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB with Mongoose
- **Authentication**: JWT tokens, OAuth (Google & GitHub)
- **UI Components**: Radix UI, Lucide React icons
- **State Management**: React Context API
- **Styling**: Tailwind CSS, CSS Variables for theming

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- MongoDB database (local or MongoDB Atlas)
- Google Cloud Console account (for Google OAuth)
- GitHub account (for GitHub OAuth)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd task-manager-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (main)/            # Protected routes
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── landingPage/       # Public landing page
├── components/            # Reusable UI components
│   └── ui/               # Shadcn/ui components
├── context/              # React Context providers
├── lib/                  # Utility functions and configurations
├── models/               # MongoDB/Mongoose models
└── types/                # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🔐 Authentication Setup

For detailed OAuth setup instructions, see [OAUTH_SETUP.md](./OAUTH_SETUP.md).

### Quick Setup:
1. **Google OAuth**: Create credentials in Google Cloud Console
2. **GitHub OAuth**: Create OAuth app in GitHub Settings
3. **Environment Variables**: Add client IDs and secrets to `.env.local`

## 📚 Documentation

- [Technical Documentation](./TECHNICAL_DOCUMENTATION.md) - Detailed technical overview
- [OAuth Setup Guide](./OAUTH_SETUP.md) - Step-by-step OAuth configuration

## 🚀 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed on any platform that supports Node.js:
- Netlify
- Railway
- Heroku
- AWS
- DigitalOcean App Platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Technical Documentation](./TECHNICAL_DOCUMENTATION.md)
2. Review the [OAuth Setup Guide](./OAUTH_SETUP.md)
3. Open an issue on GitHub

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) for accessible UI components
- [MongoDB](https://www.mongodb.com/) for the database solution
