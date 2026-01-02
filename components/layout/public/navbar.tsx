"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Artikel", href: "/articles" },
];

export function Navbar() {
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-14 items-center px-4 md:px-6">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <span className="hidden font-bold sm:inline-block">
                            Bonext
                        </span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "transition-colors hover:text-foreground/80",
                                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-bold">Bonext</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </div>
                </div>

                <div className="hidden md:flex flex-1 items-center justify-end space-x-4">
                    <div className="flex items-center gap-2">
                        <ThemeSwitcher />
                        <Button asChild><Link href="/auth/login">Login</Link></Button>
                    </div>
                </div>
            </div>
            {isMobileMenuOpen && (
                <div className="md:hidden border-t">
                    <nav className="grid gap-2 p-4">
                        {navItems.map((item) => (
                            <Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className={cn("flex w-full items-center rounded-md p-2 text-sm font-medium hover:underline", pathname === item.href ? "text-foreground" : "text-foreground/60")}>
                                {item.name}
                            </Link>
                        ))}
                        <Button asChild className="mt-2"><Link href="/auth/login">Login</Link></Button>
                    </nav>
                </div>
            )}
        </header>
    );
}