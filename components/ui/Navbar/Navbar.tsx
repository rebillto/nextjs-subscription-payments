'use client';

import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

import Logo from '@/components/icons/Logo';

import s from './Navbar.module.css';
import {useTranslations} from 'next-intl';

export default function Navbar() {
  const { user, error, isLoading } = useUser();
  const t = useTranslations('nav');

  return (
    <nav className={s.root}>
      <a href="#skip" className="sr-only focus:not-sr-only">
        {t("skipToContent")}
      </a>
      <div className="max-w-6xl px-6 mx-auto">
        <div className="relative flex flex-row justify-between py-4 align-center md:py-6">
          <div className="flex items-center flex-1">
            <Link href="/" className={s.logo} aria-label="Logo">
              <Logo />
            </Link>
            <nav className="hidden ml-6 space-x-2 lg:block">
              <Link href="/" className={s.link}>
                {t("pricing")}
              </Link>
              {user && (
                <Link href="/account" className={s.link}>
                  {t("account")}
                </Link>
              )}
            </nav>
          </div>
          <div className="flex justify-end flex-1 space-x-8">
            {user ? (
            <a href="/api/auth/logout" className={s.link}>
              {t("signOut")}
            </a>
            ) : (
              <a href="/api/auth/login" className={s.link}>
                {t("signIn")}
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}