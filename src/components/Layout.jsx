import React from "react";
import { Outlet } from "react-router-dom";
import BottomTabBar from "./BottomTabBar";

export default function Layout() {
  return (
    <div className="min-h-screen pb-[calc(4.75rem+env(safe-area-inset-bottom))]">
      <Outlet />
      <BottomTabBar />
    </div>
  );
}