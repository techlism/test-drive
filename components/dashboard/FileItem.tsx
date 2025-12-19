"use client";

import { FileData } from "./DashboardContent";
import { FileText, Image, FileVideo, FileAudio, File, Archive } from "lucide-react";
import FileActionsMenu from "./FileActionsMenu"

interface FileItemProps {
  file: FileData;
  onDeleted: (fileId: string) => void;
  onRenamed: (fileId: string, newName: string) => void;
  onRefresh: () => void;
}

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.startsWith("video/")) return FileVideo;
  if (mimeType.startsWith("audio/")) return FileAudio;
  if (mimeType.includes("pdf") || mimeType.includes("document") || mimeType.includes("text")) return FileText;
  if (mimeType.includes("zip") || mimeType.includes("archive") || mimeType.includes("compressed")) return Archive;
  return File;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const formatTimeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)}w ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)}mo ago`;
  return `${Math.floor(seconds / 31536000)}y ago`;
};

export default function FileItem({ file, onDeleted, onRenamed, onRefresh }: FileItemProps) {
  const FileIcon = getFileIcon(file.mimeType);

  return (
    <div className="rounded-lg border bg-secondary transition-all duration-200 overflow-hidden group flex flex-row md:flex-col relative">
      <div className="flex items-center justify-center p-3 md:p-8 flex-shrink-0">
        <FileIcon className="h-10 w-10 md:h-16 md:w-16" />
      </div>

      <div className="p-3 bg-primary flex-1 min-w-0">
        <p className="text-sm md:text-base font-semibold text-foreground truncate" title={file.name}>
          {file.name}
        </p>
        <p className="text-xs md:text-sm text-foreground mt-0.5 md:mt-1">
          {formatFileSize(file.size)}
        </p>
        <p className="text-xs md:text-sm md:hidden text-muted-foreground">
          {formatTimeAgo(file.createdAt)}
        </p>
        <p className="text-sm hidden md:block">
          {file.createdAt.toLocaleString()}
        </p>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 md:top-2 md:translate-y-0 right-2 md:opacity-50 md:group-hover:opacity-100 transition-opacity">
        <FileActionsMenu
          fileId={file.id}
          fileName={file.name}
          onDeleted={onDeleted}
          onRenamed={onRenamed}
          onRefresh={onRefresh}
        />
      </div>
    </div>
  );
}