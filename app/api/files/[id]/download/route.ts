import { eq, and } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { generateDownloadUrl } from "@/lib/storage";

export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { user } = await validateRequest();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;

        // Find the file and verify ownership
        const fileRecord = await db
            .select()
            .from(files)
            .where(and(eq(files.id, id), eq(files.userId, user.id)))
            .limit(1);

        if (fileRecord.length === 0) {
            return NextResponse.json(
                { error: "File not found or you don't have permission to download it" },
                { status: 404 }
            );
        }

        // Generate presigned download URL
        const downloadUrl = await generateDownloadUrl(fileRecord[0].storageKey);

        return NextResponse.json({
            success: true,
            downloadUrl,
            filename: fileRecord[0].name,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to generate download URL" },
            { status: 500 }
        );
    }
}
