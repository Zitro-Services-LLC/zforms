
import React from 'react';
import { User as UserIcon } from "lucide-react";

const AuthHeader: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <UserIcon className="w-8 h-8 text-amber-500" />
      <span className="text-2xl font-bold text-gray-900">zforms</span>
    </div>
  );
};

export default AuthHeader;
