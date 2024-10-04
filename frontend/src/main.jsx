import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  AuthLayout,
  Channel,
  Dashboard,
  Home,
  Layout,
  Login,
  Register,
  Search,
  TweetUpload,
  Video,
  VideoUpload,
} from "./pages/index.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "video/:videoId",
        element: <Video />,
      },
      {
        path: "users/channel/:username",
        element: <Channel />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "upload/",
        element: <Layout />,
        children: [
          {
            path: "video",
            element: <VideoUpload />,
          },
          {
            path: "tweet",
            element: <TweetUpload />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
