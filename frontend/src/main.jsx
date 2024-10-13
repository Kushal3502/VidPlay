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
  EditLayout,
  Home,
  Layout,
  Likes,
  Login,
  Playlist,
  PlaylistEdit,
  PlaylistUpload,
  Register,
  Search,
  Tweet,
  TweetEdit,
  TweetUpload,
  Tweets,
  Video,
  VideoEdit,
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
        path: "tweets",
        element: <Tweets />,
      },
      {
        path: "likes",
        element: <Likes />,
      },
      {
        path: "video/:videoId",
        element: <Video />,
      },
      {
        path: "tweet/:tweetId",
        element: <Tweet />,
      },
      {
        path: "playlist/:playlistId",
        element: <Playlist />,
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
        path: "upload",
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
          {
            path: "playlist",
            element: <PlaylistUpload />,
          },
        ],
      },
      {
        path: "edit",
        element: <EditLayout />,
        children: [
          {
            path: "video/:videoId",
            element: <VideoEdit />,
          },
          {
            path: "tweet/:tweetId",
            element: <TweetEdit />,
          },
          {
            path: "playlist/:playlistId",
            element: <PlaylistEdit />,
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
