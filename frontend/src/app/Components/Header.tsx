"use client";

import dynamic from "next/dynamic";

const HeaderContent = dynamic(() => import("./HeaderContent"), { ssr: false });

export default function Header() {
  return <HeaderContent />;
}
