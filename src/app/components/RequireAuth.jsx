"use client"
import { useContext } from "react";
import Link from "next/link";

import { AuthContext } from "../context/AuthContext";
 
export function RequireAuth({ children }) {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Link to="/login" replace />;
  }
  return children;
}