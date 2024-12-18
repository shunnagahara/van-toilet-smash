"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setIsPC } from "../store/slices/deviceSlice";

const MainPage: React.FC = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const isPC = window.innerWidth > 1024;
    dispatch(setIsPC(isPC));
    router.push(isPC ? "/pc" : "/sp");
  }, [dispatch, router]);

  return null;
};

export default MainPage;
