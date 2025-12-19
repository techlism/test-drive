"use client";

import { FileData } from "./DashboardContent";
import FileItem from "./FileItem";
import { FileX } from "lucide-react";

interface FileListProps {
  files: FileData[];
  onFileDeleted: (fileId: string) => void;
  onFileRenamed: (fileId: string, newName: string) => void;
  onRefresh: () => void;
}

export default function FileList({ files, onFileDeleted, onFileRenamed, onRefresh }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileX className="h-16 w-16 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-white mb-2">No files yet</h3>
        <p className="text-gray-400">Your query didn&apos;t return any files or no files uploaded yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-4">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          onDeleted={onFileDeleted}
          onRenamed={onFileRenamed}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}