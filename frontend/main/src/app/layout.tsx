import './globals.css';
import { Inter } from 'next/font/google';
import ReduxProvider from './providers/ReduxProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Your App Title',
  description: 'Your App Description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
