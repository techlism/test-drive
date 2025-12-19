"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Trash2, Edit, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import RenameDialog from "./RenameDialog";

interface FileActionsMenuProps {
    fileId: string;
    fileName: string;
    onDeleted: (fileId: string) => void;
    onRenamed: (fileId: string, newName: string) => void;
    onRefresh: () => void;
}

export default function FileActionsMenu({ fileId, fileName, onDeleted, onRenamed, onRefresh }: FileActionsMenuProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const response = await fetch(`/api/files/${fileId}/download`);

            if (!response.ok) {
                throw new Error("Failed to download file");
            }

            const data = await response.json();

            const link = document.createElement("a");
            link.href = data.downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Download started", { position: 'bottom-right' });
        } catch (error) {
            toast.error("Failed to download file", { position: 'bottom-right' });
            console.error(error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const response = await fetch(`/api/files/${fileId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete file");
            }

            toast.success("File deleted successfully", { position: 'bottom-right' });
            onDeleted(fileId);
            setShowDeleteDialog(false);
            onRefresh();
        } catch (error) {
            toast.error("Failed to delete file", { position: 'bottom-right' });
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleRename = async (newName: string) => {
        try {
            const response = await fetch(`/api/files/${fileId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });

            if (!response.ok) {
                throw new Error("Failed to rename file");
            }

            toast.success("File renamed successfully", { position: 'bottom-right' });
            onRenamed(fileId, newName);
            setShowRenameDialog(false);
            onRefresh();
        } catch (error) {
            toast.error("Failed to rename file", { position: 'bottom-right' });
            console.error(error);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="h-8 w-8 p-0 rounded-full">
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" side="left" className="w-48">
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
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete File</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &ldquo;{fileName}&rdquo;? This action cannot be undone.
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
                currentName={fileName}
                onRename={handleRename}
            />
        </>
    );
}