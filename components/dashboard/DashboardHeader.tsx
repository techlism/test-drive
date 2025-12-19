"use client";

import { User } from "lucia";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast from "react-hot-toast";

interface DashboardHeaderProps {
  user: User;
  onSearch: (query: string) => void;
  initialSearch?: string;
}

export default function DashboardHeader({ user, onSearch, initialSearch = "" }: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      const response = await fetch("/api/sign-out", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      toast.success("Signed out successfully");
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to sign out");
      console.error(error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <header className="bg-drive-dark border-b border-gray-700 sticky top-0 z-10">
      <div className="flex items-center justify-between h-16 px-4 gap-2 md:gap-4">
        <h1 className="text-lg md:text-xl font-semibold text-white whitespace-nowrap">Test-Drive</h1>

        <div className="relative flex-1 max-w-2xl">
          <Search className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search in Drive"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 md:pl-12 pr-4 py-2 bg-gray-700/50 border-none text-white placeholder:text-gray-400 rounded-lg text-sm md:text-lg font-semibold focus-visible:ring-drive-blue-hover focus-visible:ring-2"
          />
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="text-gray-300 hover:text-white hover:bg-gray-700 hidden sm:flex"
          >
            <LogOut className="h-4 w-4 mr-2" />
            {isSigningOut ? "Signing out..." : "Sign out"}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="sm:hidden">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Avatar className="h-8 w-8 rounded-md">
                  <AvatarImage src={user.avatar || ""} alt={user.username} />
                  <AvatarFallback className="bg-drive-blue text-white text-xs">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
                <LogOut className="h-4 w-4 mr-2" />
                {isSigningOut ? "Signing out..." : "Sign out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Avatar className="h-8 w-8 hidden sm:block">
            <AvatarImage src={user.avatar || ""} alt={user.username} />
            <AvatarFallback className="bg-drive-blue text-white">
              {user.username.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}