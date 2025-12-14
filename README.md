# Cortex DB Frontend

The modern, intelligent dashboard for the Cortex CMS. Built with React 19, Vite, and Shadcn/UI, it offers a premium user experience for content management.

**Repository:** [https://github.com/umairrx/cortex](https://github.com/umairrx/cortex)
**Backend:** [https://github.com/umairrx/cortex-backend](https://github.com/umairrx/cortex-backend)

## 🌟 Features

- **Modern Architecture**: Built on React 19 and Vite for blazing fast performance.
- **Premium UI/UX**: Designed with Shadcn/UI and Tailwind CSS v4.
- **Dynamic Collection Management**: Visual interface to create and manage data schemas.
- **Real-time Updates**: Powered by TanStack Query.
- **Dark Mode**: Built-in heavy/light mode switching.
- **Responsive**: Fully mobile-responsive layout.

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: Shadcn/UI + Radix Primitives
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v7
- **Icons**: Lucide React & Tabler Icons

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/umairrx/cortex.git
    cd cortex
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    # or npm install
    ```

3.  **Environment Configuration**
    Create a `.env` file in the root directory:

    ```env
    # API Configuration
    VITE_API_BASE_URL=http://localhost:3000/api
    ```

4.  **Start Development Server**
    ```bash
    pnpm dev
    ```

## 📜 Scripts

| Script | Description |
| :--- | :--- |
| `pnpm dev` | Starts the Vite development server. |
| `pnpm build` | Builds the application for production. |
| `pnpm preview` | Locally preview the production build. |
| `pnpm lint` | Runs ESLint and Biome checks. |

## 🏗️ Project Structure

- `src/components`: Reusable UI components (buttons, dialogs, etc.).
- `src/pages`: Application views/routes.
- `src/lib`: Utilities and API configuration.
- `src/hooks`: Custom React hooks (logic reuse).
- `src/contexts`: Global state providers (Auth, Theme).

## 🚢 Deployment

1.  Build the project:
    ```bash
    pnpm build
    ```

2.  Deploy the contents of the `dist/` folder to any static host:
    - **Vercel**: Zero config needed (usually).
    - **Netlify**: Drag and drop `dist` folder.
    - **S3/CloudFront**: Upload static assets.
    - **Nginx**: Serve `dist` folder as static files.

