"use client";

import React from "react";
// import MobileConsole from "./components/MobileConsole";

export default function SPLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div>
      {children}
      {/* <MobileConsole /> */}
    </div>
  );
}