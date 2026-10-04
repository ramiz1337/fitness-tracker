"use client";

import dynamic from "next/dynamic";

const AuthProvider = dynamic(
  () => import("react-auth-kit").then((module) => module.AuthProvider),
  { ssr: false },
);

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