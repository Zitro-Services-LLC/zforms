
import React from 'react';

interface AuthTabsProps {
  tab: "login" | "register" | "forgot-password";
  setTab: (tab: "login" | "register" | "forgot-password") => void;
}

const TABS = [
  { label: "Sign In", value: "login" },
  { label: "Sign Up", value: "register" },
];

const AuthTabs: React.FC<AuthTabsProps> = ({ tab, setTab }) => {
  return (
    <div className="flex justify-center gap-2 mb-6">
      {TABS.map(t => (
        <button
          key={t.value}
          onClick={() => setTab(t.value as "login" | "register")}
          className={`px-4 py-2 font-medium rounded-t ${
            tab === t.value
              ? "bg-amber-100 text-amber-600"
              : "bg-gray-50 text-gray-500 hover:text-amber-600"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
};

export default AuthTabs;
