# Project Context: second-brain-frontend

This document outlines the key aspects of the `second-brain-frontend` project for quick reference.

## 1. Project Overview

This is a frontend application built using **React** and **TypeScript**, bootstrapped with **Vite**. It appears to be a "Second Brain" application, likely for organizing notes, sources, or knowledge.

## 2. Tech Stack

- **UI Framework**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching & Caching**: [TanStack React Query](https://tanstack.com/query/latest)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Linting & Formatting**: ESLint & Prettier

## 3. Project Structure

The `src` directory is organized as follows:

- `src/assets`: Static assets like images.
- `src/component`: Reusable React components.
    - `Auth/`: Components related to authentication (e.g., `PrivateRoute`).
    - `sharedComponents/`: Components used across multiple pages (e.g., modals, headers).
    - `ui/`: Generic, low-level UI elements (e.g., `Button`, `Card`, `AppLayout`).
- `src/config`: Configuration files, such as the Axios instance setup (`axios.config.tsx`).
- `src/icons`: SVG icons imported as React components.
- `src/page`: Top-level components that correspond to application pages/routes (e.g., `login`, `summary`).
- `src/store`: Zustand state management stores (`authStore`, `sourceStore`).

## 4. Available Scripts

The following scripts are defined in `package.json`:

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Compiles TypeScript and builds the application for production.
- `npm run lint`: Lints the codebase using ESLint.
- `npm run preview`: Serves the production build locally for preview.

## 5. Key Conventions

- **API Calls**: Handled through a pre-configured `axios` instance located in `src/config/axios.config.tsx`.
- **State Management**: Global state is managed with `zustand`. There are separate stores for authentication (`authStore`) and application data (`sourceStore`).
- **Data Fetching**: Asynchronous server state (e.g., fetching data from an API) is managed by `TanStack React Query`.
- **Routing**: The application uses `react-router-dom` for navigation, with page components located in the `src/page` directory.
- **Styling**: Utility-first CSS is implemented with Tailwind CSS.

## 6. Installation

To get a local copy up and running, follow these simple steps.

### Prerequisites

- npm (Node Package Manager)
    ```bash
    npm install npm@latest -g
    ```

### Installation

1.  Clone the repo
    ```bash
    git clone https://github.com/your_username/second-brain-frontend.git
    ```
2.  Install NPM packages
    ```bash
    npm install
    ```

## 7. Usage

### Development

To run the project in development mode:

```bash
npm run dev
```

This will start the Vite development server, usually at `http://localhost:5173`.

### Building for Production

To build the project for production:

```bash
npm run build
```

This will compile the TypeScript code and create a production-ready build in the `dist` directory.

### Previewing Production Build

To preview the production build locally:

```bash
npm run preview
```

## 8. Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 9. License

Distributed under the MIT License. See `LICENSE` for more information.

## 10. Author

- S.M. Ghulam Ghaus Faiyaz
