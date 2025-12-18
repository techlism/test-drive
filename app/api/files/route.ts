import { desc, eq, like, and } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { files } from "@/lib/db/schema";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const { user } = await validateRequest();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search");

        // Build query based on search parameter
        let results;
        if (search && search.trim()) {
            // Drizzle ORM uses parameterized queries which prevent SQL injection
            // Note: We allow users to use SQL LIKE wildcards (% and _) in their search
            // This is intentional to provide more flexible search capabilities
            results = await db
                .select()
                .from(files)
                .where(
                    and(
                        eq(files.userId, user.id),
                        like(files.name, `%${search}%`)
                    )
                )
                .orderBy(desc(files.createdAt));
        } else {
            results = await db
                .select()
                .from(files)
                .where(eq(files.userId, user.id))
                .orderBy(desc(files.createdAt));
        }

        return NextResponse.json({
            files: results,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch files" },
            { status: 500 }
        );
    }
}
