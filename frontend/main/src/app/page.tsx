"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation"; // next/navigationからuseRouterをインポート

const MainPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const isPC = window.innerWidth > 1024; // 1024px以上ならPCと判定
    router.push(isPC ? "/pc" : "/sp");
  }, [router]);

  return null; // リダイレクト後はこのページの内容は表示されない
};

export default MainPage;
