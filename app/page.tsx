import { redirect } from "next/navigation";
import SignInWithGoogle from "@/components/SignInWithGoogle";
import { validateRequest } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { user } = await validateRequest();

  if (user) {
    redirect("/dashboard");
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-primary">File Manager</h1>
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900">
              Store & Manage Your Files
            </h2>
            <p className="text-xl text-gray-600">
              Upload, organize, and access your files securely from anywhere.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <SignInWithGoogle />
          </div>
        </div>
      </main>
    </div>
  );
}
