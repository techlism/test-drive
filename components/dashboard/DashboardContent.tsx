"use client";

import { useState, useEffect } from "react";
import { User } from "lucia";
import DashboardHeader from "./DashboardHeader";
import FileList from "./FileList";
import FileUpload from "./FileUpload";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export interface FileData {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

interface DashboardContentProps {
  user: User;
  initialFiles: FileData[];
  initialSearch: string;
}

export default function DashboardContent({ user, initialFiles, initialSearch }: DashboardContentProps) {
  const [files, setFiles] = useState<FileData[]>(initialFiles);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Update files when initialFiles changes (after server refresh)
  useEffect(() => {
    setFiles(initialFiles);
  }, [initialFiles]);

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set('search', query);
    } else {
      params.delete('search');
    }

    router.push(`/dashboard?${params.toString()}`);
  };

  const handleFileUploaded = () => {
    router.refresh();
  };

  const handleFileDeleted = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleFileRenamed = (fileId: string, newName: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName } : f));
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-drive-dark flex flex-col">
      <DashboardHeader user={user} onSearch={handleSearch} initialSearch={initialSearch} />

      <main className="flex-1 overflow-auto px-4 md:px-8 py-4 md:py-6 pb-24">
        <div className="mb-4 md:mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">My Drive</h2>
        </div>

        <FileList
          files={files}
          onFileDeleted={handleFileDeleted}
          onFileRenamed={handleFileRenamed}
          onRefresh={handleRefresh}
        />
      </main>

      {/* Floating Upload Button */}
      <Button
        onClick={() => setUploadDialogOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 md:h-16 md:w-16 rounded-full shadow-lg bg-drive-blue hover:bg-drive-blue-hover z-50"
        size="icon"
      >
        <Plus className="h-6 w-6 md:h-7 md:w-7" />
      </Button>

      <FileUpload
        onFileUploaded={handleFileUploaded}
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
}