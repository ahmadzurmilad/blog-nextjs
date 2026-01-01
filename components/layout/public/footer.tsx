import Link from "next/link";

const footerLinks = [
    { name: "Kebijakan Privasi", href: "/pages/kebijakan-privasi" },
    { name: "Syarat dan Ketentuan", href: "/pages/syarat-dan-ketentuan" },
    { name: "Tentang", href: "/pages/tentang" },
];

export function Footer() {
    return (
        <footer className="bg-muted border-t">
            <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                        © {new Date().getFullYear()} MyBlog. All rights reserved.
                    </p>
                </div>
                <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
                    {footerLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </footer>
    );
}