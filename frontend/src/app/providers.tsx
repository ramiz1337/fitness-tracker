"use client";

import { AuthProvider } from "react-auth-kit";

export default function Providers({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider
      authType="localstorage"
      authName="_auth"
    >
      {children}
    </AuthProvider>
  );
}