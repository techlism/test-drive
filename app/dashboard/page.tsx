import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import DashboardContent from "@/components/dashboard/DashboardContent";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

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

async function getFiles(search: string) {
  try {
    const url = search !== ""
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/files?search=${encodeURIComponent(search)}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/api/files`;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cookie': cookieHeader,
      },
    });

    if (response.ok) {
      const data: FilesApiResponse = await response.json();
      return data.files.map((f) => ({
        id: f.id,
        name: f.name,
        size: f.size,
        mimeType: f.mimeType,
        createdAt: new Date(f.createdAt)
      }));
    }
    return [];
  } catch (error) {
    console.error("Failed to fetch files:", error);
    return [];
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/");
  }

  const search = (await searchParams).search || "";
  const initialFiles = await getFiles(search);

  return <DashboardContent user={user} initialFiles={initialFiles} initialSearch={search} />;
}