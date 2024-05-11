import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Agent Practice',
  description: 'A practice project for AI agents',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="container py-24">
          <Toaster position="top-right" duration="1800" />
          {children}
        </main>
      </body>
    </html>
  );
}
