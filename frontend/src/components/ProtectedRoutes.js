import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import Layout from "./Layout";

export default function ProtectedRoutes() {
  const token = localStorage.getItem("token");

  return token ? (
    <Layout>
      <Outlet />
    </Layout>
  ) : (
    <Navigate to="/login" replace />
  );
}
