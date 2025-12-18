import { nanoid } from "nanoid";
import { type NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { generatePresignedUrl } from "@/lib/storage";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const { user } = await validateRequest();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { filename, contentType, contentLength } = body;

        if (!filename || !contentType || !contentLength) {
            return NextResponse.json(
                { error: "Missing required fields: filename, contentType, contentLength" },
                { status: 400 }
            );
        }

        // Generate presigned URL for upload
        const { uploadUrl, fileKey, publicUrl } = await generatePresignedUrl(
            user.id,
            filename,
            contentType,
            contentLength
        );

        // Create file record in database
        const fileId = nanoid();
        await db.insert(files).values({
            id: fileId,
            userId: user.id,
            name: filename,
            storageKey: fileKey,
            size: contentLength,
            mimeType: contentType,
        });

        return NextResponse.json({
            success: true,
            fileId,
            uploadUrl,
            publicUrl,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to generate upload URL" },
            { status: 500 }
        );
    }
}
