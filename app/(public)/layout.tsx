import { Navbar } from "@/components/layout/public/navbar";
import { Footer } from "@/components/layout/public/footer";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}