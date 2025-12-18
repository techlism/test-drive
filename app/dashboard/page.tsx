import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth";
import DashboardContent from "@/components/dashboard/DashboardContent";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/");
  }

  return <DashboardContent user={user} />;
}
