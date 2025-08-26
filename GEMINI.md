# GEMINI.md - reminder-admin

## Project Overview

This project, `reminder-admin`, is a front-end application based on the **Vue3 Admin Better** framework. It is a comprehensive admin panel built with **Vue.js 3** and the **Element Plus** UI component library.

The primary goal of the framework is to provide a high-performance, easy-to-use boilerplate for developing admin interfaces, with a focus on fast build times and a smooth development experience.

**Key Technologies:**

*   **Framework:** Vue.js 3
*   **UI:** Element Plus
*   **Bundler:** Rspack (a fast, Rust-based web bundler)
*   **State Management:** Vuex
*   **Routing:** Vue Router
*   **Styling:** SCSS

**Architecture:**

*   The application entry point is `src/main.js`, which initializes the Vue app, router, Vuex store, and other plugins.
*   The overall structure is a Single-Page Application (SPA).
*   Routing is split into `constantRoutes` (publicly accessible, like `/login`) and `asyncRoutes` (which are likely loaded based on user permissions).
*   The project uses a mock server (`mock/`) for API simulation during development, which is enabled by default.
*   Configuration files in `src/config/` control various aspects of the application, such as network settings, permissions, and theme.
*   The build system is configured in `rspack.config.js` and `rspack.js`.

## Building and Running

The project uses `pnpm` as the package manager. Key commands are defined in `package.json`.

### Development

To run the local development server:

```bash
# Install dependencies
pnpm install

# Start the dev server with rspack
pnpm run serve:rspack
```

This will start a hot-reloading development server, typically at `http://localhost:8091`.

### Production Build

To build the application for production:

```bash
# Create a production-ready build in the /dist directory
pnpm run build
```

To create a production build and package it into a `.zip` file:

```bash
# Build and create a zip archive
pnpm run build:zip
```

## Development Conventions

*   **Code Style:** The project enforces a strict ESLint configuration (`plugin:vue/recommended`). It is recommended to use a code editor with ESLint integration for auto-fixing.
*   **File Structure:** The code is organized into standard Vue application directories:
    *   `src/api`: API request modules.
    *   `src/assets`: Static assets like images and fonts.
    *   `src/components`: Reusable Vue components.
    *   `src/layouts`: Application layout components (e.g., sidebar, navbar).
    *   `src/router`: Vue Router configuration.
    *   `src/store`: Vuex store modules.
    *   `src/views`: Page components corresponding to routes.
*   **Routing:** The application uses a distinction between main layouts (`Layout`) and empty layouts (`EmptyLayout`). Routes that should be displayed within the main admin panel (with sidebars and navbars) must use the `Layout` component.
*   **Mocking:** The project heavily utilizes `mockjs` to simulate a backend. Mock API endpoints are defined in the `mock/controller/` directory. This is enabled in both development and production by default, as noted in `src/main.js`.
*   **Permissions:** The routing metadata includes a `permissions` field (e.g., `meta: { permissions: ["admin"] }`), indicating that the project uses a role-based access control (RBAC) model for managing route access.
