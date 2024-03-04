import * as React from "react";
import {
  createBrowserRouter,
} from "react-router-dom";

import HomePage from "./home";
import UserListPage from "./user";
import "../App.css";
import ProtectedRoute from "./protectedRoute";
import AuthRedirectRoute from "./authRedirectRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirectRoute><HomePage /></AuthRedirectRoute>,
  },
  {
    path: "/users",
    element: <ProtectedRoute><UserListPage /></ProtectedRoute>
  }
]);
