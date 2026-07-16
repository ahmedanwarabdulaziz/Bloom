import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-jakarta",
});

export const metadata: Metadata = {
    title: "Bloom | Restaurant & Coffee Shop",
    description: "Experience the finest food and drinks at Bloom. A premium restaurant and coffee shop.",
    manifest: "/manifest.json",
};

export const viewport: Viewport = {
    themeColor: "#121212",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Restaurant',
        name: 'Bloom',
        description: 'Experience the finest food and drinks at Bloom. A premium restaurant and coffee shop.',
        hasMenu: '/menu'
    };

    return (
        <html lang="en" className={jakarta.variable}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className="antialiased font-sans text-main-text bg-background">{children}</body>
        </html>
    );
}
