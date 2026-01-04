import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Vjen - Physiotherapy Appointment Scheduling',
    description: 'Modern appointment scheduling platform for physiotherapists. Book your next session with ease.',
    keywords: ['physiotherapy', 'appointments', 'scheduling', 'healthcare', 'booking'],
    authors: [{ name: 'Vjen' }],
    openGraph: {
        title: 'Vjen - Physiotherapy Appointment Scheduling',
        description: 'Modern appointment scheduling platform for physiotherapists. Book your next session with ease.',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body>
                {children}
            </body>
        </html>
    );
}
