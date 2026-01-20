# Student Frontend Project Example

This is a **React + Vite** frontend template designed to help you learn modern web development practices. It uses **Tailwind CSS** for styling and includes examples of Authentication, Routing, and CRUD operations connected to a backend.

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (v14 or higher) installed.
- The backend project running on port 3000 (default).

### 2. Installation

Open your terminal in this folder and run:

```bash
npm install
```

### 3. Running the Project

To start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

## 📂 Project Structure

- `src/components/ui/` - Reusable UI components (Buttons, Inputs, Cards).
- `src/context/` - Global state management (Authentication).
- `src/layouts/` - Page structure (Sidebar, Header).
- `src/pages/` - Individual screens (Login, Dashboard, Articles).
- `src/services/` - API communication configuration.

## 🔗 Backend Connection

This project assumes your backend API is running at `http://localhost:3000`.
To change this, create a `.env` file in the root directory (copy `.env.example` if it exists) and update:

```
VITE_API_URL=http://localhost:3000
```

## 📚 Key Concepts to Study

1. **Authentication Context (`AuthContext.jsx`)**: How we store the user content and protect the app.
2. **Protected Routes (`ProtectedRoute.jsx`)**: Preventing access to pages if not logged in.
3. **API Interceptors (`api.js`)**: Automatically adding the authentication token to every request.
4. **Tailwind CSS**: How to style components using utility classes.

## 📝 Assignments

1. Register a new user using the backend/postman and try to login here.
2. Review the code in `Articles.jsx` and try to add a new field to the Article form.
3. styling: Try changing the color scheme in `tailwind.config.js` or `index.css`.

Happy Coding!
