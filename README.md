# 🧪 React Developer Assessment Project

This project is built as part of a React Developer Assessment. It includes full authentication flows, protected routes, drag-and-drop functionality, infinite scroll, and a dynamic sidebar — all implemented using **React + TypeScript** with best practices and modern libraries.

---

## 🚀 Features

### 🔐 Authentication
- **Register**: User signup with validation (Formik + Yup). Auto-login on success.
- **Login**: Email/password login. Error handling and localStorage token storage.
- **Forgot Password**: Mocked functionality with error toast display.

### 🧭 Sidebar Navigation
- Sidebar with icons for:
  - 🏠 Home (User Info)
  - 🧩 Drag and Drop Board
  - 🔃 Infinite Scroll
- Click the sidebar toggle icon to collapse to icon-only view, click again to expand.

### 📊 Drag and Drop Board
- Top Row: Draggable profile cards (user pic, name, designation).
- Below: Three side-by-side columns (Project 1, Project 2, Project 3) accepting draggable cards.
- Powered by `react-beautiful-dnd`.

### 🖼 Infinite Scroll
- Fetches images from [Dog API](https://dog.ceo/api/breeds/image/random/5)
- Loads 5 images at a time with infinite scroll behavior.

### 🔄 Routing
- Public Routes: Register, Login, Forgot Password
- Private Routes: Home, Drag and Drop, Infinite Scroll

---

## 📦 Tech Stack

- **React + TypeScript**
- **Formik + Yup** (form handling & validation)
- **Axios** (API requests)
- **React Query** (data fetching, optional)
- **ShadCN UI** (or Tailwind as fallback)
- **React Router v6+**
- **react-beautiful-dnd** (drag and drop)
- **Custom Hooks**:
  - `useAuth` – handles login/logout & auth state
  - `useFetchWithLoader` – fetch wrapper with loading/error
  - `useSidebarToggle` – manages sidebar state
- **Global Loader** on async requests
- **Error Boundary** for crash handling

---

## 🌐 API Endpoints

Use the following endpoints to integrate authentication features:

### Register
```bash
curl --location 'https://second-brain-web.onrender.com/api/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.do1e1@example.com",
  "password": "@Invimatic@123"
}'
---
### 👨‍💻 Author
Rushikesh Jagtap
Frontend Developer
GitHub: @rushij27
