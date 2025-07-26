import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import router from "./router";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{zIndex: 999999}}
          aria-label={undefined}      />
    </>
  );
}
