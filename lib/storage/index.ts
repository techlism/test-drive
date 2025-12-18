import {
    DeleteObjectCommand,
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const r2Client = new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT || "",
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
    },
});

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_FILE_SIZE_MB = 100;

export const generateFileKey = (userId: string, originalName: string): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const uniqueId = nanoid(12);
    
    // Separate filename and extension
    const lastDotIndex = originalName.lastIndexOf('.');
    const baseName = lastDotIndex > 0 ? originalName.substring(0, lastDotIndex) : originalName;
    const extension = lastDotIndex > 0 ? originalName.substring(lastDotIndex) : '';
    
    // Sanitize only the basename to be filesystem and URL safe
    const sanitizedBaseName = baseName
        .replace(/[\\/:*?"<>|]/g, '_')   // Replace filesystem-unsafe chars
        .replace(/\s+/g, '_')             // Replace spaces with underscores
        .substring(0, 200);                // Limit length
    
    const sanitizedFilename = sanitizedBaseName + extension;

    return `files/${userId}/${year}/${month}/${day}/${uniqueId}_${sanitizedFilename}`;
};

export const generatePresignedUrl = async (
    userId: string,
    filename: string,
    contentType: string,
    contentLength: number,
): Promise<{ uploadUrl: string; fileKey: string; publicUrl: string }> => {
    if (contentLength > MAX_FILE_SIZE) {
        const maxSizeMB = Math.floor(MAX_FILE_SIZE / (1024 * 1024));
        throw new Error(`File too large. Maximum size is ${maxSizeMB}MB.`);
    }

    const fileKey = generateFileKey(userId, filename);

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME || "",
        Key: fileKey,
        ContentType: contentType,
        ContentLength: contentLength,
        CacheControl: "public, max-age=31536000",
        Metadata: {
            "uploaded-by": "file-manager",
            "upload-timestamp": new Date().toISOString(),
        },
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 });
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${fileKey}`;

    return {
        uploadUrl,
        fileKey,
        publicUrl,
    };
};

export const generateDownloadUrl = async (
    fileKey: string,
): Promise<string> => {
    const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME || "",
        Key: fileKey,
    });

    return await getSignedUrl(r2Client, command, { expiresIn: 3600 });
};

export const deleteFile = async (fileKey: string): Promise<void> => {
    try {
        const command = new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME || "",
            Key: fileKey,
        });

        await r2Client.send(command);
    } catch (error) {
        console.error("Failed to delete file from R2:", error);
    }
};

export const validateFile = (
    file: File,
): { valid: boolean; error?: string } => {
    if (file.size > MAX_FILE_SIZE) {
        const maxSizeMB = Math.floor(MAX_FILE_SIZE / (1024 * 1024));
        return {
            valid: false,
            error: `File too large. Maximum size is ${maxSizeMB}MB.`,
        };
    }

    return { valid: true };
};

export const uploadFileToR2 = async (
    file: File,
    uploadUrl: string,
): Promise<void> => {
    const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type,
        },
    });

    if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
    }
};