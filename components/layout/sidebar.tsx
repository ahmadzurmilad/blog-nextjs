'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, FileText, Layers, User, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

const sidebarItems = [
    {
        title: 'Dashboard',
        href: '/protected',
        icon: LayoutDashboard,
    },
    {
        title: 'Articles',
        href: '/protected/admin/articles',
        icon: FileText,
    },
    {
        title: 'Pages',
        href: '/protected/admin/pages',
        icon: Layers,
    },
    {
        title: 'Profile',
        href: '/protected/admin/profiles',
        icon: User,
    },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    onNavigate?: () => void
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const { signOut } = useAuth()

    const handleLogout = async () => {
        await signOut()
        router.push('/auth/login')
    }

    return (
        <div className={cn("flex h-full w-64 flex-col border-r bg-background", className)}>
            <div className="flex h-14 items-center border-b px-6 font-semibold">
                Admin Panel
            </div>
            <div className="flex-1 overflow-auto py-4">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onNavigate}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                                pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="border-t p-4">
                <Button variant="outline" className="w-full justify-start gap-2" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}