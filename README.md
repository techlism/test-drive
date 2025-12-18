# Test Drive

A modern Google Drive-like file management application with cloud storage capabilities.

## Tech Stack

-   **Framework**: Next.js 15.3.3 with TypeScript
-   **Styling**: Tailwind CSS with shadcn UI components
-   **Database**: Turso (libSQL) with Drizzle ORM
-   **Authentication**: Lucia Auth with Arctic (For OAuth providers)
-   **File Storage**: Cloudflare R2 (S3-compatible)

## Features

-   🔐 **User Authentication** - Secure OAuth login with Google
-   📤 **File Upload** - Upload any file type with drag-and-drop support
-   📥 **File Download** - Download your stored files anytime
-   🗑️ **File Deletion** - Remove files you no longer need
-   ✏️ **File Rename** - Rename files with ease
-   🔍 **File Search** - Quickly find files by name
-   👤 **User Profiles** - Personal dashboard for each user
-   📱 **Responsive Design** - Works seamlessly on desktop and mobile

## Prerequisites

-   Node.js 18+
-   npm/yarn/pnpm
-   Cloudflare R2 bucket credentials
-   Turso database credentials
-   Google OAuth credentials

## Environment Variables

Create a `.env.local` file in the root directory:

```env
DATABASE_URL=libsql://********.turso.io
DATABASE_AUTH_TOKEN=ey******
NEXT_PUBLIC_BASE_URL=http://localhost:3000
GOOGLE_CLIENT_SECRET=GOCSPX-******************
GOOGLE_CLIENT_ID=************.apps.googleusercontent.com
# R2 (S3 Compatible)
R2_ACCESS_KEY_ID=5****
R2_SECRET_ACCESS_KEY=e8b6*****************
R2_ENDPOINT=https://****************.r2.cloudflarestorage.com
R2_BUCKET_NAME=bucketname
R2_PUBLIC_URL=https://pub******.r2.dev
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/techlism/test-drive.git
cd test-drive
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see above)

4. Run database migrations:

```bash
node --env-file=.env.local ./node_modules/.bin/drizzle-kit push
```

Alternatively, generate migrations:

```bash
node --env-file=.env.local ./node_modules/.bin/drizzle-kit generate
```

5. Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access the application.

## Available Scripts

-   `npm run dev` - Start development server
-   `npm run build` - Build for production
-   `npm run start` - Start production server
-   `npm run lint` - Run ESLint
-   `npm run db:push` - Push database schema changes
-   `npm run db:generate` - Generate database migrations

## Database Setup

This project uses Turso (libSQL) with Drizzle ORM. To set up:

1. Create a Turso database at [turso.tech](https://turso.tech)
2. Get your database URL and auth token
3. Add them to your `.env.local` file
4. Run migrations with `node --env-file=.env.local ./node_modules/.bin/drizzle-kit push`

Alternatively, you can create tables directly in Turso console.

## File Storage

Files are stored in Cloudflare R2, an S3-compatible object storage service:

1. Create an R2 bucket in your Cloudflare dashboard
2. Generate API credentials (Access Key ID and Secret Access Key)
3. Configure a public R2 domain for file access
4. Add credentials to your `.env.local` file

## Deployment

The application can be deployed on:

-   **Vercel** (Recommended for Next.js)
-   **Netlify**
-   Any platform supporting Next.js applications

### Deployment Checklist:

-   ✅ Set up environment variables in your hosting platform
-   ✅ Configure Google OAuth redirect URLs for production domain
-   ✅ Ensure R2 bucket CORS settings allow your domain
-   ✅ Run database migrations in production

## Project Structure

```
test-drive/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── dashboard/      # Main application pages
│   └── auth/           # Authentication pages
├── components/          # React components
│   ├── ui/             # shadcn UI components
│   └── ...             # Custom components
├── lib/                 # Utility functions and configurations
│   ├── db/             # Database configuration
│   ├── storage/        # R2 storage utilities
│   └── auth/           # Authentication utilities
├── drizzle/            # Database schema and migrations
└── public/             # Static assets
```

## Core Functionality

### File Management

-   Upload files up to the configured size limit
-   Download files directly from cloud storage
-   Rename files while preserving metadata
-   Delete files permanently from storage and database
-   Search through your files by filename

### Security

-   User authentication required for all operations
-   Files are isolated per user
-   Secure session management with Lucia Auth
-   OAuth 2.0 integration with Google

## License

MIT

## Support

For issues and feature requests, please open an issue on GitHub.
