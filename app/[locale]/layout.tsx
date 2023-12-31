import StoreProvider from '../../contexts/defaultStore';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import 'styles/main.css';
import Script from 'next/script';

const meta = {
  title: 'Next.js Rebill Subscription Starter',
  description: 'Brought to you by Vercel and Rebill.',
  cardImage: '/og.png',
  robots: 'follow, index',
  favicon: '/favicon.ico',
  url: process.env.NEXT_PUBLIC_SITE_URL,
  type: 'website'
};

export const metadata = {
  title: meta.title,
  description: meta.description,
  cardImage: meta.cardImage,
  robots: meta.robots,
  favicon: meta.favicon,
  url: meta.url,
  type: meta.type,
  openGraph: {
    url: meta.url,
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage,
    type: meta.type,
    site_name: meta.title
  },
  twitter: {
    card: 'summary_large_image',
    site: '@vercel',
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage
  }
};

interface RootLayoutProps {
  children: ReactNode;
  params: {
    locale: string; // Define the type for the 'locale' property
  };
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }, { locale: 'pt' }];
}

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
  params: { locale }
}: RootLayoutProps) {
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
  return (
    <html lang={locale}>
      <body className="bg-black loading">
        <UserProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            <StoreProvider>
              <Navbar />
              <main
                id="skip"
                className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]"
              >
                {children}
              </main>
              <Footer />
            </StoreProvider>
          </NextIntlClientProvider>
        </UserProvider>
      </body>
    </html>
  );
}
