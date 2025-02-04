"use client";
import React, { createContext, useState, useEffect } from "react";
import { account } from "@/config/appwrite";
import { User } from "@/types/user";

export const AuthContext = createContext<{
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}>({
  user: null,
  login: async () => {},
  logout: async () => {},
});
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      const accountDetails = await account.get();
      setUser({
        id: accountDetails.$id,
        email: accountDetails.email,
        name: accountDetails.name,
      });
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    await account.deleteSession("current");
    setUser(null);
  };

  useEffect(() => {
    const checkUser = async () => {
      try {
        const accountDetails = await account.get();
        setUser({
          id: accountDetails.$id,
          email: accountDetails.email,
          name: accountDetails.name,
        });
      } catch (error) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
