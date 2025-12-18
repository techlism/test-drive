"use client";

import { useState } from "react";
import { FileData } from "./DashboardContent";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Edit, FileText, Image, FileVideo, FileAudio, File, Archive, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import RenameDialog from "./RenameDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const getFileType = (mimeType: string): string => {
  const parts = mimeType.split("/");
  if (parts.length === 2) {
    return parts[1].toUpperCase();
  }
  return mimeType.toUpperCase();
};

export default function FileItem({ file, onDeleted, onRenamed, onRefresh }: FileItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const FileIcon = getFileIcon(file.mimeType);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch(`/api/files/${file.id}/download`);

      if (!response.ok) {
        throw new Error("Failed to download file");
      }

      const data = await response.json();

      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Download started",
        {
          position: 'bottom-right'
        }
      );
    } catch (error) {
      toast.error("Failed to download file",
        {
          position: 'bottom-right'
        }
      );
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/files/${file.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      toast.success("File deleted successfully",
        {
          position: 'bottom-right'
        }
      );
      onDeleted(file.id);
      setShowDeleteDialog(false);
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete file",
        {
          position: 'bottom-right'
        }
      );
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRename = async (newName: string) => {
    try {
      const response = await fetch(`/api/files/${file.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename file");
      }

      toast.success("File renamed successfully",
        {
          position: 'bottom-right'
        }
      );
      onRenamed(file.id, newName);
      setShowRenameDialog(false);
      onRefresh();
    } catch (error) {
      toast.error("Failed to rename file",
        {
          position: 'bottom-right'
        }
      );
      console.error(error);
    }
  };

  return (
    <>
      <div className="rounded-lg border transition-all duration-200 overflow-hidden group">
        <div className="bg-secondary flex items-center justify-center p-8 relative">
          <FileIcon className="h-16 w-16" />

          <div className="absolute top-2 right-2 opacity-50 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  // variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleDownload} disabled={isDownloading} className="font-medium">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowRenameDialog(true)} className="font-medium">
                  <Edit className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:bg-destructive focus:text-foreground font-medium"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Permanently
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="p-3 bg-primary">
          <p className="text-base font-semibold text-foreground truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-sm text-foreground mt-1">
            {formatFileSize(file.size)}
          </p>
          <p className="text-sm">
            {file.createdAt.toLocaleString()}
          </p>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{file.name}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <RenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        currentName={file.name}
        onRename={handleRename}
      />
    </>
  );
}
