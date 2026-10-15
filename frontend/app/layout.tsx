// frontend/app/layout.tsx
import './globals.css';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'Multi-Vendor E-Commerce Platform',
  description: 'Shop best products from top vendors',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}