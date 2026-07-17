# Week 5 Task: Multi-Tenant SaaS Platform

## 1. Project Overview
This project is a production-level Multi-Tenant SaaS platform featuring role-based access control, real-time collaboration, and organization-based data isolation. The platform allows users to create workspaces, invite members (Admins/Members), and collaborate on projects and tasks.

## 2. Key Features Implemented
- **Multi-Tenant Architecture**: Strict data isolation using `organizationId` across all models. Users can switch between multiple workspaces.
- **Authentication & Security**: JWT-based authentication with refresh tokens, alongside Google OAuth integration. Passwords are encrypted using bcrypt. API rate limiting and Helmet headers enhance security.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `Admin` and `Member` roles within each organization. Admins have exclusive rights to manage workspace members, billing, and settings.
- **Real-Time Capabilities**: Socket.io enables live updates for notifications, task status changes, and member activities.
- **Advanced CRUD & Analytics**: Complex data management for Projects, Tasks, and Members with robust pagination and search functionalities. The dashboard provides insightful analytics on task progression.
- **Activity & Audit Logs**: A dedicated logging service tracks all critical actions (e.g., Member joined, Task created) for accountability.
- **File Uploads**: Cloudinary integration for handling avatar uploads and project attachments.
- **Neo-Brutalist UI**: A highly responsive, uniquely styled Neo-Brutalist interface built with Next.js and Tailwind CSS.
- **Background Jobs**: Node Cron configured for scheduled tasks such as database cleanup or email notifications.

## 3. Tech Stack
- **Frontend**: Next.js 14, React, Tailwind CSS (Neo-Brutalism Theme), Zustand (State Management), Axios.
- **Backend**: Node.js, Express.js, Socket.io, Mongoose.
- **Database**: MongoDB (Atlas).
- **Tools & Third Party**: Cloudinary, PayU (Mocked/Test Integration), Postman for API documentation.

## 4. Challenges Faced
1. **Handling Multi-Tenant Security**: Ensuring that users could not access or modify data belonging to an organization they are not part of. This required writing custom middleware to verify `organizationId` context on every protected route.
2. **Real-time State Synchronization**: Integrating Socket.io with Zustand state management on the frontend was complex, specifically ensuring that only users within the same organization receive specific real-time events.
3. **Admin Self-Demotion Edge Cases**: We encountered logic bugs where an Admin could accidentally demote or remove themselves from a workspace, leaving the workspace orphaned. This was resolved by implementing strict server-side checks (`isCurrentUser`) preventing self-demotion.

## 5. Key Learnings
- **Mongoose Complex Queries**: Mastered using `populate` and advanced aggregation pipelines to fetch nested data (e.g., getting a project alongside its tasks and assignee details).
- **Socket.io Namespaces/Rooms**: Learned how to isolate WebSocket events by placing users into "Rooms" named after their current `organizationId`, drastically improving performance and security.
- **Design Systems**: Building a custom Neo-Brutalist design system from scratch using Tailwind CSS utility classes expanded my understanding of CSS custom properties and theme configuration.
