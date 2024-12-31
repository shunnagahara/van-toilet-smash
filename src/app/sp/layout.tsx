"use client";

import React from "react";
import MobileConsole from "./components/MobileConsole";

// SPページ用のレイアウト
export default function SPLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div>
      {children}
      <MobileConsole />
    </div>
  );
}