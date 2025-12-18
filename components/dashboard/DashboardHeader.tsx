"use client";

import { User } from "lucia";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
  user: User;
  onSearch: (query: string) => void;
}

export default function DashboardHeader({ user, onSearch }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-drive-dark border-b border-gray-700 sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-4 flex-1">
          <h1 className="text-xl font-semibold text-white">Test-Drive</h1>

          <div className="relative max-w-2xl w-full mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search in Drive"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-12 pr-4 py-2 bg-gray-700/50 border-none text-white placeholder:text-gray-400 rounded-lg text-lg font-semibold focus-visible:ring-drive-blue-hover focus-visible:ring-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || ""} alt={user.username} />
            <AvatarFallback className="bg-drive-blue text-white">{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
