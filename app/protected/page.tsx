"use client";

import { AuthProvider } from "@/contexts/auth-provider";
import { useAuth } from "@/hooks/use-auth";

// Komponen internal untuk menampilkan data auth
const AuthDebugView = () => {
  const { user, role, loading, signOut } = useAuth();

  if (loading) {
    return <div className="p-8 text-center">Loading auth status...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Status Panel */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Auth Context State</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium text-muted-foreground">Is Authenticated:</dt>
              <dd className={user ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                {user ? "YES" : "NO"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-muted-foreground">Role (Context):</dt>
              <dd className="font-mono">{role || "null"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium text-muted-foreground">Loading:</dt>
              <dd className="font-mono">{loading.toString()}</dd>
            </div>
          </dl>

          {user && (
            <button
              onClick={() => signOut()}
              className="mt-6 w-full px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          )}
        </div>

        {user && (
          <div className="border rounded-lg p-6 bg-card shadow-sm">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">User Metadata</h2>
            <dl className="space-y-2 text-sm">
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="font-medium text-muted-foreground">Email:</dt>
                <dd>{user.email}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="font-medium text-muted-foreground">ID:</dt>
                <dd className="font-mono text-xs truncate" title={user.id}>{user.id}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="font-medium text-muted-foreground">Last Sign In:</dt>
                <dd>{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "-"}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="font-medium text-muted-foreground">Created At:</dt>
                <dd>{new Date(user.created_at).toLocaleString()}</dd>
              </div>
              <div className="grid grid-cols-[120px_1fr] gap-2">
                <dt className="font-medium text-muted-foreground">Provider:</dt>
                <dd>{user.app_metadata.provider}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* Raw Data View */}
      {user ? (
        <div className="border rounded-lg p-6 bg-card shadow-sm">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Raw User Object</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Ini adalah data lengkap yang dikembalikan oleh Supabase Auth. Anda bisa mengakses properti ini melalui object <code>user</code>.
          </p>
          <pre className="bg-muted text-foreground p-4 rounded-md overflow-auto text-xs font-mono max-h-[500px]">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="p-6 border border-dashed rounded-lg text-center bg-muted/50">
          <p className="text-muted-foreground">Login untuk melihat detail data user.</p>
        </div>
      )}
    </div>
  );
};

export default function TestProviderPage() {
  return (
    <AuthProvider>
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Auth Provider Inspector</h1>
          <p className="text-muted-foreground mb-8">
            Halaman ini digunakan untuk men-debug data yang tersedia di dalam AuthContext.
          </p>
          <AuthDebugView />
        </div>
      </div>
    </AuthProvider>
  );
}