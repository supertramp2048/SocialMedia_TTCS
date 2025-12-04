# Admin Panel Setup Guide

## Prerequisites

- Node.js version ^20.19.0 or >=22.12.0
- npm or yarn package manager
- Backend Laravel API running (default: http://127.0.0.1:8000)

## Installation

1. Navigate to the admin panel directory:
```bash
cd adminSocialMedia
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:

**Option A: Using Laravel Websockets (Local)**
```env
VITE_API_BASE_URL=http://127.0.0.1:8000

# Laravel Websockets Configuration
VITE_PUSHER_APP_KEY=your-local-app-key
VITE_PUSHER_HOST=127.0.0.1
VITE_PUSHER_PORT=6001
VITE_PUSHER_SCHEME=http
```

**Option B: Using Pusher Cloud**
```env
VITE_API_BASE_URL=http://127.0.0.1:8000

# Pusher Cloud Configuration
VITE_PUSHER_APP_KEY=your-pusher-app-key
VITE_PUSHER_APP_CLUSTER=mt1
VITE_PUSHER_SCHEME=https
```

**Option C: Disable Real-time Features (No Pusher)**
```env
VITE_API_BASE_URL=http://127.0.0.1:8000

# Leave Pusher variables empty or don't set them
```

## Running the Development Server

```bash
npm run dev
```

The admin panel will be available at `http://localhost:5174` (or the port specified in vite.config.js).

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Preview Production Build

```bash
npm run preview
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run test:unit` - Run unit tests

## Project Structure

```
adminSocialMedia/
├── src/
│   ├── api/              # API services
│   ├── assets/           # Static assets
│   ├── components/       # Vue components
│   │   ├── admin/        # Admin-specific components
│   │   └── common/       # Shared components
│   ├── layouts/          # Layout components
│   ├── plugins/          # Plugins (Echo, etc.)
│   ├── router/           # Vue Router configuration
│   ├── stores/           # Pinia stores
│   ├── types/            # TypeScript type definitions
│   └── views/            # Page components
├── docs/                 # Documentation
├── public/               # Public assets
└── package.json
```

## Authentication

The admin panel uses Laravel Sanctum for authentication. Make sure your backend API is configured correctly:

1. The login endpoint should be at `/api/login`
2. The logout endpoint should be at `/api/logout`
3. The current user endpoint should be at `/api/user`
4. All API requests include the Bearer token in the Authorization header

## Role-Based Access Control

The admin panel supports different user roles:

- **user**: Regular user (no admin access)
- **moderator**: Can view and resolve reports
- **admin**: Full admin access (users, posts, categories, etc.)
- **superadmin**: Can manage staff roles

Routes are protected based on user roles. Users without the required role will be redirected to the dashboard.

## Connecting to Backend

1. Ensure your Laravel backend is running
2. Update `VITE_API_BASE_URL` in `.env` to match your backend URL
3. If using Pusher for real-time features, configure the Pusher credentials

## Troubleshooting

### CORS Issues

If you encounter CORS errors, make sure your Laravel backend has CORS configured correctly in `config/cors.php`.

### Authentication Issues

- Check that the token is being stored correctly in cookies
- Verify the backend API endpoints are working
- Check browser console for error messages

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf node_modules/.vite`

## Next Steps

1. Configure your backend API URL
2. Set up Pusher credentials if using real-time features
3. Customize the appearance and branding
4. Add any additional features as needed

