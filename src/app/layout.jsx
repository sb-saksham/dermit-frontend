"use client"
import "./globals.css";
import Navbar from "./components/Navbar";
import { AuthContextProvider } from "./context/AuthContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthContextProvider>
          <Navbar/>
          <div className="max-w-5xl mx-auto py-6">
            {children}
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
