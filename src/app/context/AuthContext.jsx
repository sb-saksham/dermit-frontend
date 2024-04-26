"use client"
import axios from "axios";
import React, { createContext, useState } from "react";
import authHeader from "../services/AuthHeaders";
import AuthService from "../services/AuthService";
import { useRouter } from "next/navigation";
 
const DefaultProps = {
  login: () => null,
  logout: () => null,
  authAxios: axios,
  user: null
};
 
export const AuthContext = createContext(DefaultProps);
 
export const AuthContextProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(() => AuthService.getCurrentUser());
 
  async function login(username, password) {
    const data = await AuthService.login(username, password);
    setUser(data);
    return data;
  }
 
  function logout() {
    AuthService.logout();
    setUser(null);
    router.push("/login");
  }
 
  // axios instance for making requests
  const authAxios = axios.create();
 
  // request interceptor for adding token
  authAxios.interceptors.request.use((config) => {
    // add token to request headers
    config.headers = authHeader();
    return config;
  });
 
  authAxios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
 
  return (
    <AuthContext.Provider value={{ user, login, logout, authAxios }}>
      {children}
    </AuthContext.Provider>
  );
};
