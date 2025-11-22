# Admin Panel - Social Media Management

A comprehensive admin panel built with Vue 3, TypeScript, Vite, and Tailwind CSS for managing a social media platform.

## Features

- 🔐 **Authentication**: Secure login/logout with Laravel Sanctum
- 👥 **User Management**: View, ban, and unban users
- 📝 **Post Management**: View and moderate posts
- 🚩 **Report Management**: Handle reports for posts, comments, and users
- 📁 **Category Management**: Create, update, and delete categories
- 👨‍💼 **Staff Management**: Manage admin and moderator roles (Superadmin only)
- 🎨 **Appearance Settings**: Customize site appearance (UI ready, backend integration pending)
- 📊 **Dashboard**: Overview of platform statistics and recent activity

## Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Next-generation frontend tooling
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management
- **Vue Router** - Official router for Vue.js
- **Axios** - HTTP client
- **Laravel Echo** - WebSocket library for real-time features
- **Pusher** - Real-time communication
- **Vue Toastification** - Toast notifications
- **Heroicons** - Beautiful SVG icons

## Quick Start

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment**:
Create a `.env` file with:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_PUSHER_APP_KEY=your-pusher-key
VITE_PUSHER_APP_CLUSTER=mt1
VITE_PUSHER_HOST=127.0.0.1
VITE_PUSHER_PORT=6001
VITE_PUSHER_SCHEME=http
```

3. **Run development server**:
```bash
npm run dev
```

4. **Build for production**:
```bash
npm run build
```

## Project Structure

```
adminSocialMedia/
├── src/
│   ├── api/              # API service layer
│   │   ├── apiClient.ts  # Axios instance with interceptors
│   │   ├── auth.ts       # Authentication endpoints
│   │   ├── users.ts      # User management endpoints
│   │   ├── posts.ts     # Post management endpoints
│   │   ├── reports.ts   # Report management endpoints
│   │   ├── categories.ts # Category management endpoints
│   │   ├── staff.ts     # Staff management endpoints
│   │   └── comments.ts  # Comment management endpoints
│   ├── components/       # Vue components
│   │   ├── admin/        # Admin-specific components
│   │   │   ├── Sidebar.vue
│   │   │   ├── Topbar.vue
│   │   │   └── StatsCard.vue
│   │   └── common/       # Shared components
│   │       ├── DataTable.vue
│   │       ├── Pagination.vue
│   │       ├── Modal.vue
│   │       ├── Badge.vue
│   │       └── LoadingSpinner.vue
│   ├── layouts/          # Layout components
│   │   ├── AdminLayout.vue
│   │   └── AuthLayout.vue
│   ├── plugins/          # Plugins
│   │   └── echo.ts      # Laravel Echo configuration
│   ├── router/           # Vue Router
│   │   └── index.ts     # Routes and guards
│   ├── stores/           # Pinia stores
│   │   ├── auth.ts      # Authentication store
│   │   ├── users.ts     # Users store
│   │   ├── posts.ts     # Posts store
│   │   ├── reports.ts   # Reports store
│   │   └── categories.ts # Categories store
│   ├── types/            # TypeScript types
│   │   └── index.ts
│   └── views/            # Page components
│       ├── auth/         # Authentication pages
│       ├── dashboard/    # Dashboard
│       ├── users/         # User management
│       ├── posts/        # Post management
│       ├── reports/      # Report management
│       ├── categories/   # Category management
│       ├── staff/        # Staff management
│       ├── comments/     # Comment management
│       └── appearance/   # Appearance settings
├── docs/                  # Documentation
│   ├── setup.md         # Setup guide
│   └── admin-api-used.md # API endpoints documentation
└── package.json
```

## Authentication & Authorization

The admin panel uses role-based access control:

- **user**: No admin access
- **moderator**: Can view and resolve reports
- **admin**: Full access (users, posts, categories, etc.)
- **superadmin**: Can manage staff roles

Routes are automatically protected based on user roles.

## API Integration

The admin panel connects to a Laravel backend API. See `docs/admin-api-used.md` for a complete list of endpoints used.

## Development

### Linting
```bash
npm run lint
```

### Formatting
```bash
npm run format
```

### Testing
```bash
npm run test:unit
```

## Documentation

- [Setup Guide](./docs/setup.md) - Detailed setup instructions
- [API Documentation](./docs/admin-api-used.md) - List of all API endpoints used

## License

Private project - All rights reserved

