import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import Layout from "./Layout.tsx";
import RootError from "./RootError.tsx";
import Post from "./routes/Post.tsx";
import User from "./routes/User.tsx";
import Settings from "./routes/Settings.tsx";
import PostError from "./routes/PostError.tsx";
import UserError from "./routes/UserError.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SetMe from "./component/settings/SetMe.tsx";
import SetPwd from "./component/settings/SetPwd.tsx";
import SignOut from "./component/settings/SignOut.tsx";
import SignIn from "./routes/SignIn.tsx";
import WritePost from "./routes/WritePost.tsx";
import EditPost from "./routes/EditPost.tsx";
import SelectableHome from "./routes/SelectableHome.tsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <RootError />,
    children: [
      {
        index: true,
        element: <SelectableHome />,
      },
      {
        path: "/p/:postId",
        element: <Post />,
        errorElement: <PostError />,
      },
      {
        path: "/p/:postId/edit",
        element: <EditPost />,
      },
      {
        path: "/u/:handle",
        element: <User />,
        errorElement: <UserError />,
      },
      {
        path: "/settings",
        element: <Settings />,
        children: [
          {
            index: true,
            loader: async () => redirect("setme"),
          },
          {
            path: "/settings/setme",
            element: <SetMe />,
          },
          {
            path: "/settings/setpwd",
            element: <SetPwd />,
          },
          {
            path: "/settings/signout",
            element: <SignOut />,
          },
        ],
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/post",
        element: <WritePost />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
