"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Updated UserType to match MongoDB structure
export type UserType = {
  _id: string;
  aadhaarId: string;
  name: string;
  gender?: string;
  dateOfBirth?: string;
  fullAddress?: string;
  email?: string;
  phone?: string;
  role: string;
  photo?: string;
  // Add medical info
  medical?: {
    bloodType?: string;
    height?: string;
    weight?: string;
    allergies?: Array<{
      type: string;
      severity: string;
      reaction: string;
    }>;
    emergencyContact?: {
      name: string;
      relation: string;
      phone: string;
    };
  };
};

type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  isLoading: boolean;
  error: string | null;
  login: (aadhaarId: string, password: string) => Promise<void>;
  logout: () => void;
  fetchUserProfile: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse stored user data", e);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Login function that connects to MongoDB
  const login = async (aadhaarId: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ aadhaarId, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      if (data.success && data.user) {
        // Store user in state and localStorage
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log("User logged in successfully:", data.user.name);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log("User logged out");
  };

  // Fetch user profile from MongoDB
  const fetchUserProfile = async () => {
    if (!user?.aadhaarId) {
      setError("No user logged in");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5000/api/users/profile/${user.aadhaarId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Combine user data with medical data
        const updatedUser = {
          ...data.user,
          medical: data.medical
        };
        
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log("User profile updated from MongoDB");
      } else {
        throw new Error(data.message || 'Failed to fetch profile');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user profile');
      console.error('Profile fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    setUser,
    isLoading,
    error,
    login,
    logout,
    fetchUserProfile
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};