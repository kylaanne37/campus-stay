import React from "react";
import { NavLink } from "react-router-dom";
import { Home as HomeIcon, List, Plus, Settings as SettingsIcon } from "lucide-react";

const tabs = [
  { to: "/", label: "Browse", icon: HomeIcon, end: true },
  { to: "/my-listings", label: "My Listings", icon: List, end: false },
  { to: "/create", label: "Post Room", icon: Plus, end: false },
  { to: "/settings", label: "Settings", icon: SettingsIcon, end: false },
];

export default function BottomTabBar() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/90 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-6xl items-stretch justify-around">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium transition active:opacity-60 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}