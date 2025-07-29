import { createBrowserRouter } from "react-router-dom"
import AppLayout from "./layout/AppLayout"
import Home from "./pages/Dashboard/Home"
import SignIn from "./pages/AuthPages/SignIn"
import SignUp from "./pages/AuthPages/SignUp"
import NotFound from "./pages/OtherPage/NotFound"
import UserProfiles from "./pages/UserProfiles"
import AdminRoutes from "./pages/AuthPages/AdminRoutes.tsx"
import BookPage from "./pages/BookPage.tsx";
import ReaderPage from "./pages/ReaderPage.tsx";
import LendPage from "./pages/LendPage.tsx";

const router = createBrowserRouter([
  { path: "/", element: <SignIn /> }, // Default route is full-screen sign-in
  { path: "/signin", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },

  {
    path: "",
    element: (
        <AdminRoutes>
          <AppLayout />
        </AdminRoutes>
    ),
    children: [
      { path: "book", element: <BookPage/>},
      { path: "reader", element: <ReaderPage/>},
      { path: "lend", element: <LendPage/>},
      { path: "home", element: <Home /> },
      { path: "profile", element: <UserProfiles /> },
      { path: "*", element: <NotFound /> },
    ],
  },
])

export default router
