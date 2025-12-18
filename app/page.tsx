import { redirect } from "next/navigation";
import SignInWithGoogle from "@/components/SignInWithGoogle";
import { validateRequest } from "@/lib/auth";
import { FileText, Search, Download, Upload, Shield, Zap } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { user } = await validateRequest();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20">
        <div className="max-w-3xl mx-auto text-center space-y-12">
          {/* Hero Section */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4" />
              <span>Secure Cloud Storage</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              Test-Drive &rarr; Your Files, with you anywhere
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              A simple and secure way to store, manage, and access your files from any device.
              Upload documents, images, and more with confidence.
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center gap-4 pt-4">
            <SignInWithGoogle />
            <p className="text-sm text-gray-500">
              Sign in with your Google account to get started
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 pt-12 text-left">
            <div className="flex gap-4 p-6 rounded-lg border border-gray-200 bg-white">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Easy Upload</h3>
                <p className="text-sm text-gray-600">
                  Drag and drop files or browse to upload. Supports all file types with size limits up to your storage quota.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-lg border border-gray-200 bg-white">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Search className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Quick Search</h3>
                <p className="text-sm text-gray-600">
                  Find your files instantly with our powerful search. Filter by name to locate what you need in seconds.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-lg border border-gray-200 bg-white">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Organize & Rename</h3>
                <p className="text-sm text-gray-600">
                  Keep your files organized with easy renaming and management tools. Your files, your way.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 rounded-lg border border-gray-200 bg-white">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Secure & Private</h3>
                <p className="text-sm text-gray-600">
                  Your files are encrypted and stored securely. Only you have access to your content, always.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}