import { eq, and, sql } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";
import { deleteFile } from "@/lib/storage";

export const dynamic = 'force-dynamic';

export async function DELETE(
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
                { error: "File not found or you don't have permission to delete it" },
                { status: 404 }
            );
        }

        // Delete from S3/R2
        await deleteFile(fileRecord[0].storageKey);

        // Delete from database
        await db.delete(files).where(eq(files.id, id));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to delete file" },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { user } = await validateRequest();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id } = await params;
        const body = await request.json();
        const { name } = body;

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        // Verify file ownership
        const fileRecord = await db
            .select()
            .from(files)
            .where(and(eq(files.id, id), eq(files.userId, user.id)))
            .limit(1);

        if (fileRecord.length === 0) {
            return NextResponse.json(
                { error: "File not found or you don't have permission to rename it" },
                { status: 404 }
            );
        }

        // Update file name and timestamp
        await db
            .update(files)
            .set({ 
                name,
                updatedAt: sql`(unixepoch())`
            })
            .where(eq(files.id, id));

        return NextResponse.json({ success: true, name });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to rename file" },
            { status: 500 }
        );
    }
}
