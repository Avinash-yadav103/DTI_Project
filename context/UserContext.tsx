// context/UserContext.tsx
"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserType = {
  aadharNumber: string;
  basicDetails: {
    code: number;
    data: {
      address: {
        country: string;
        district: string;
        house: string;
        landmark: string;
        pincode: string;
        postOffice: string;
        state: string;
        street: string;
        subdistrict: string;
        vtc: string;
      };
      careOf: string;
      dateOfBirth: string;
      emailHash: string;
      fullAddress: string;
      gender: string;
      mobileHash: string;
      name: string;
      referenceId: string;
      shareCode: string;
      status: string;
      yearOfBirth: number;
    };
    message: string;
  };
  createdAt: string;
  medicalDetails: {
    allergies: { reaction: string; severity: string; type: string }[];
    bloodGroup: string;
  };
  password: string;
  userId: string;
};

type UserContextType = {
  user: UserType | null;
  setUser: (user: UserType) => void;
};

const UserContext = createContext<{ user: UserContextType | null }>({ user: null });


export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};