# Admin Panel API Endpoints Used

This document lists all the backend API endpoints used by the admin panel.

## Authentication Endpoints

### Login
- **Endpoint**: `POST /api/login`
- **Method**: POST
- **Body**: `{ email: string, password: string }`
- **Response**: `{ token: string, user: User }`
- **Used in**: Login page

### Logout
- **Endpoint**: `POST /api/logout`
- **Method**: POST
- **Headers**: `Authorization: Bearer {token}`
- **Used in**: Topbar logout button

### Get Current User
- **Endpoint**: `GET /api/user`
- **Method**: GET
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `User`
- **Used in**: Auth store, route guards

## User Management Endpoints (Admin)

### Get Users
- **Endpoint**: `GET /api/users/search`
- **Method**: GET
- **Query Params**: `page`, `limit`, `search`
- **Response**: `PaginatedResponse<User>`
- **Used in**: User list page

### Get User Details
- **Endpoint**: `GET /api/profiles/{id}`
- **Method**: GET
- **Response**: `User`
- **Used in**: User detail page

### Get Banned Users
- **Endpoint**: `GET /api/admin/users/banned`
- **Method**: GET
- **Query Params**: `page`, `limit`
- **Headers**: `Authorization: Bearer {token}`, `role:admin`
- **Response**: `PaginatedResponse<User>`
- **Used in**: Locked users page

### Ban User
- **Endpoint**: `POST /api/admin/users/{id}/ban`
- **Method**: POST
- **Headers**: `Authorization: Bearer {token}`, `role:admin`
- **Body**: `{ duration_days?: number }` (optional, permanent if omitted)
- **Response**: `{ message: string, banned_until: string }`
- **Used in**: User list page

### Unban User
- **Endpoint**: `POST /api/admin/users/{id}/unban`
- **Method**: POST
- **Headers**: `Authorization: Bearer {token}`, `role:admin`
- **Response**: `{ message: string }`
- **Used in**: Locked users page

### Get Moderation History
- **Endpoint**: `GET /api/admin/users/{id}/moderation-history`
- **Method**: GET
- **Headers**: `Authorization: Bearer {token}`, `role:admin`
- **Response**: `{ user_info: {...}, violations: {...} }`
- **Used in**: User detail page

## Post Management Endpoints

### Get Posts
- **Endpoint**: `GET /api/posts`
- **Method**: GET
- **Query Params**: `page`, `limit`, `sort`, `category`, `q`, `user_id`, `status`
- **Response**: `PaginatedResponse<Post>`
- **Used in**: Post list page, dashboard

### Get Post Details
- **Endpoint**: `GET /api/posts/{id}`
- **Method**: GET
- **Response**: `Post`
- **Used in**: Post detail page

### Delete/Remove Post
- **Endpoint**: `DELETE /api/posts/{id}`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ message: string }`
- **Used in**: Post list, post detail page

## Report Management Endpoints (Moderator)

### Get Post Reports
- **Endpoint**: `GET /api/moderator/reports/posts`
- **Method**: GET
- **Query Params**: `page`, `limit`
- **Headers**: `Authorization: Bearer {token}`, `role:moderator`
- **Response**: `PaginatedResponse<ReportPost>`
- **Used in**: Reports page

### Get Comment Reports
- **Endpoint**: `GET /api/moderator/reports/comments`
- **Method**: GET
- **Query Params**: `page`, `limit`
- **Headers**: `Authorization: Bearer {token}`, `role:moderator`
- **Response**: `PaginatedResponse<ReportComment>`
- **Used in**: Reports page

### Get User Reports
- **Endpoint**: `GET /api/moderator/reports/users`
- **Method**: GET
- **Query Params**: `page`, `limit`
- **Headers**: `Authorization: Bearer {token}`, `role:moderator`
- **Response**: `PaginatedResponse<ReportUser>`
- **Used in**: Reports page

### Resolve Post Report
- **Endpoint**: `DELETE /api/moderator/reports/posts/{id}`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer {token}`, `role:moderator`
- **Response**: `{ message: string }`
- **Used in**: Reports page

### Resolve Comment Report
- **Endpoint**: `DELETE /api/moderator/reports/comments/{id}`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer {token}`, `role:moderator`
- **Response**: `{ message: string }`
- **Used in**: Reports page

### Resolve User Report
- **Endpoint**: `DELETE /api/moderator/reports/users/{id}`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer {token}`, `role:moderator`
- **Response**: `{ message: string }`
- **Used in**: Reports page

## Category Management Endpoints (Admin)

### Get Categories
- **Endpoint**: `GET /api/admin/categories`
- **Method**: GET
- **Query Params**: `page`, `limit`
- **Headers**: `Authorization: Bearer {token}`, `role:admin`
- **Response**: `PaginatedResponse<Category>`
- **Used in**: Category list page

### Get Category Details
- **Endpoint**: `GET /api/admin/categories/{id}`
- **Method**: GET
- **Headers**: `Authorization: Bearer {token}`, `role:admin`
- **Response**: `Category`
- **Used in**: Category management

### Create Category
- **Endpoint**: `POST /api/admin/categories`
- **Method**: POST
- **Headers**: `Authorization: Bearer {token}`, `role:admin`
- **Body**: `{ name: string, slug?: string, description?: string }`
- **Response**: `Category`
- **Used in**: Category list page

### Update Category
- **Endpoint**: `PUT /api/admin/categories/{id}`
- **Method**: PUT
- **Headers**: `Authorization: Bearer {token}`, `role:admin`
- **Body**: `{ name: string, slug?: string, description?: string }`
- **Response**: `Category`
- **Used in**: Category list page

### Delete Category
- **Endpoint**: `DELETE /api/admin/categories/{id}`
- **Method**: DELETE
- **Headers**: `Authorization: Bearer {token}`, `role:admin`
- **Response**: `{ message: string }`
- **Used in**: Category list page

## Staff Management Endpoints (Superadmin)

### Update User Role
- **Endpoint**: `PATCH /api/superadmin/users/{id}/role`
- **Method**: PATCH
- **Headers**: `Authorization: Bearer {token}`, `role:superadmin`
- **Body**: `{ role: 'user' | 'moderator' | 'admin' | 'superadmin' }`
- **Response**: `{ message: string, user: User }`
- **Used in**: Staff management (future implementation)

## Broadcasting Endpoint

### Authorize Channel
- **Endpoint**: `POST /broadcasting/auth`
- **Method**: POST
- **Headers**: `Authorization: Bearer {token}`
- **Body**: `{ socket_id: string, channel_name: string }`
- **Response**: Authentication data for Pusher
- **Used in**: Laravel Echo configuration

## Notes

1. All endpoints requiring authentication need the `Authorization: Bearer {token}` header
2. Role-based endpoints require the user to have the appropriate role (admin, moderator, superadmin)
3. Pagination is handled using Laravel's default pagination format
4. Error responses follow Laravel's standard error format
5. The admin panel automatically handles 401 errors by redirecting to the login page

## Future Endpoints (Not Yet Implemented)

The following features are prepared in the UI but require backend API implementation:

- **Hidden Comments**: Endpoint to fetch comments with status `removed_by_mod` or `hidden`
- **Appearance Settings**: Endpoints for managing site logo, banner, colors, footer content
- **Dashboard Stats**: Endpoint to fetch aggregated statistics (total users, posts, reports, etc.)
- **Staff Creation**: Endpoint to create new admin/moderator accounts

