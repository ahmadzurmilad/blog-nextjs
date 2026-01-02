import { AuthProvider } from "@/contexts/auth-provider";
import { Header } from '@/components/layout/header'
import { Sidebar } from '@/components/layout/sidebar'

export default function ProtectedLayout({

    children,
}: {
    children: React.ReactNode
}) {

    return (
        <AuthProvider>
            <div className="flex min-h-screen w-full bg-muted/40">
                {/* Sidebar (Hidden on mobile usually, but kept simple here) */}
                <div className="hidden md:block fixed inset-y-0 left-0 z-10 w-64 border-r bg-background">
                    <Sidebar />
                </div>

                {/* Main Content Area */}
                <div className="flex flex-col min-h-screen w-full md:pl-64 transition-all duration-300 ease-in-out">
                    <Header />
                    <main className="flex-1 p-6">
                        {children}
                    </main>
                </div>

            </div>
        </AuthProvider>
    )
}