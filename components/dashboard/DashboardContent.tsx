"use client";

import { useState, useEffect } from "react";
import { User } from "lucia";
import DashboardHeader from "./DashboardHeader";
import FileList from "./FileList";
import FileUpload from "./FileUpload";
import Sidebar from "./Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

export interface FileData {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

interface ApiFileData {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: number;
  userId: string;
  storageKey: string;
  updatedAt: number;
}

interface FilesApiResponse {
  files: ApiFileData[];
}

interface DashboardContentProps {
  user: User;
}

export default function DashboardContent({ user }: DashboardContentProps) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const fetchFiles = async (search?: string) => {
    try {
      setLoading(true);
      const url = search ? `/api/files?search=${encodeURIComponent(search)}` : "/api/files";
      const response = await fetch(url);
      if (response.ok) {
        const data: FilesApiResponse = await response.json();
        setFiles(data.files.map((f) => ({
          id: f.id,
          name: f.name,
          size: f.size,
          mimeType: f.mimeType,
          createdAt: new Date(f.createdAt)
        })));
      }
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    fetchFiles(query);
  };

  const handleFileUploaded = () => {
    fetchFiles(searchQuery);
  };

  const handleFileDeleted = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleFileRenamed = (fileId: string, newName: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, name: newName } : f));
  };

  const handleRefresh = () => {
    fetchFiles(searchQuery);
  };

  return (
    <div className="min-h-screen bg-drive-dark flex flex-col">
      <DashboardHeader user={user} onSearch={handleSearch} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar onNewFile={() => setUploadDialogOpen(true)} />

        <main className="flex-1 overflow-auto px-8 py-6">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-2xl font-semibold text-white">My Drive</h2>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl bg-gray-700" />
              ))}
            </div>
          ) : (
            <FileList
              files={files}
              onFileDeleted={handleFileDeleted}
              onFileRenamed={handleFileRenamed}
              onRefresh={handleRefresh}
            />
          )}
        </main>
      </div>

      <FileUpload
        onFileUploaded={handleFileUploaded}
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
}
