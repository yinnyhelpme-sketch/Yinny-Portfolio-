import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Yinny | Community Management Portfolio',
  description: 'A portfolio showcasing community management, Discord server operations, and moderation tools.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
