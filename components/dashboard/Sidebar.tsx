"use client";

import { HardDrive, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onNewFile: () => void;
}

export default function Sidebar({ onNewFile }: SidebarProps) {
  return (
    <aside className="w-64 bg-drive-dark border-r border-gray-700 p-4 flex flex-col gap-4">
      <Button
        onClick={onNewFile}
        className="bg-drive-blue hover:bg-drive-blue-hover text-white rounded-lg px-6 py-6 shadow-lg flex items-center gap-2 justify-center font-medium text-base"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Upload a New File</span>
      </Button>
    </aside>
  );
}
