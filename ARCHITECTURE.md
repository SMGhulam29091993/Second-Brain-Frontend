# Second Brain Frontend - Architecture Documentation

This document describes the architectural design, technology stack, and project structure of the **Second Brain Frontend**.

## 🚀 Technology Stack

- **Framework:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **State Management:** 
    - [Zustand](https://zustand-demo.pmnd.rs/) (Global state & Persistence)
    - [TanStack Query v5](https://tanstack.com/query/latest) (Server state & Caching)
- **Routing:** [React Router 7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **API Client:** [Axios](https://axios-http.com/)
- **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

---

## 📂 Directory Structure

```text
src/
├── assets/             # Static assets (images, logos)
├── component/          # React components
│   ├── Auth/           # Authentication-related components (e.g., PrivateRoute)
│   ├── sharedComponents/ # Reusable complex components (Header, Modal, etc.)
│   └── ui/             # Atomic UI components (Button, Card, Input, Layout)
├── config/             # Configuration files (Axios, API settings)
├── icons/              # Custom SVG icon components
├── page/               # Page-level components (Routes)
├── store/              # Zustand state stores
├── App.tsx             # Main application component & Router
├── index.css           # Global styles and Tailwind directives
├── main.tsx            # Application entry point
└── vite-env.d.ts       # Type definitions for Vite environment
```

---

## 🧠 State Management

### 1. Global State (Zustand)
Used for client-side state that needs to persist across sessions or be accessed globally.
- **`authStore.tsx`**: Manages authentication tokens. Uses `persist` middleware to sync with `localStorage`.
- **`sourceStore.tsx`**: Manages content sources and filtering state.

### 2. Server State (React Query)
Used for all API interactions. It handles:
- Automatic caching and revalidation.
- Loading and error states.
- Optimistic updates.

---

## 🛣️ Routing & Navigation

The application uses **React Router 7** with the following features:
- **Lazy Loading:** Components are loaded on demand using `React.lazy` and `Suspense` to improve initial load time.
- **Protected Routes:** `PrivateRoute` component ensures that only authenticated users can access specific routes (e.g., `/dashboard`).
- **Dynamic Routing:** Supports dynamic paths for shared content (e.g., `/brain/:hashCode`).

---

## 🔌 API Integration (Axios)

A centralized Axios instance is configured in `src/config/axios.config.tsx`:
- **Base URL:** Loaded from environment variables (`VITE_BASE_URL`).
- **Request Interceptor:** Automatically attaches the `Authorization: Bearer <token>` header from the Zustand store.
- **Response Interceptor:** 
    - Handles token expiration (401/403 errors).
    - Attempts to silently refresh the token via `/user/refresh-token`.
    - Retries the original request upon successful refresh.

---

## 🎨 Styling & UI

- **Tailwind CSS 4:** Modern, utility-first CSS framework for rapid UI development.
- **AppLayout HOC:** A Higher-Order Component (`src/component/ui/appLayout.tsx`) that wraps pages with a consistent Header and Sidebar structure.
- **Dark Mode:** Supports dark mode using Tailwind's `dark:` utility classes.
- **Icons:** Custom SVG icons are managed as React components in `src/icons/` for maximum flexibility and performance.

---

## 🔐 Authentication Flow

1. **Login/Signup:** Users authenticate via standard forms.
2. **Token Storage:** JWT tokens are stored in the Zustand `authStore` (persisted in `localStorage`).
3. **Route Guarding:** `App.tsx` checks for the presence of a token to redirect users between public (Login/Register) and private (Dashboard) routes.
4. **Email Verification:** Implements OTP-based verification flow.
5. **Password Management:** Complete flow for "Forgot Password" and "Change Password".

---

## 🛠️ Development & Build

- **Linting:** ESLint with TypeScript and React plugins.
- **Formatting:** Prettier for consistent code style.
- **Build Command:** `npm run build` (compiles TS and bundles via Vite).
- **Environment Variables:** Managed via `.env` files (e.g., `VITE_BASE_URL`).
