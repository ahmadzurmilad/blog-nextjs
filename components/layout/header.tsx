'use client'

import { useState } from 'react'
import { Menu, LogOut, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/sidebar'
import { useAuth } from '@/hooks/use-auth'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ThemeSwitcher } from '@/components/theme-switcher'

export function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user, signOut } = useAuth()
    const router = useRouter()

    const handleLogout = async () => {
        await signOut()
        router.push('/auth/login')
    }

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-6 w-full">
            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
            >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
            </Button>

            <div className="flex flex-1 items-center justify-between">
                <h1 className="text-lg font-semibold">Dashboard</h1>

                <div className="flex items-center gap-4">
                    <ThemeSwitcher />
                    <span className="text-sm text-muted-foreground">
                        Welcome, {user?.user_metadata?.first_name || user?.email || "User"}
                    </span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-8 rounded-full overflow-hidden p-0">
                                {user?.user_metadata?.avatar_url ? (
                                    <img
                                        src={user.user_metadata.avatar_url}
                                        alt="Avatar"
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full bg-muted flex items-center justify-center">
                                        <UserIcon className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.user_metadata?.first_name || 'User'}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/protected/profile">
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Logout</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="fixed inset-0 bg-black/80" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="relative flex h-full w-64 flex-col bg-background shadow-xl animate-in slide-in-from-left">
                        <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} className="border-none" />
                    </div>
                </div>
            )}
        </header>
    )
}