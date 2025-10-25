import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';

const LOGO_IMAGE = '/merak-logo.svg';

export const metadata: Metadata = {
  title: 'Merak',
  description: 'Find, compare, and connect with the tools that fit you.',
  applicationName: 'Merak',
  icons: {
    icon: LOGO_IMAGE,
    shortcut: LOGO_IMAGE,
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
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
