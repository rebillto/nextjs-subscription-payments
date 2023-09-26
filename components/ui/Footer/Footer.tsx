'use client';

import GitHub from '@/components/icons/GitHub';
import Logo from '@/components/icons/Logo';
import { useStore } from '@/contexts/defaultStore';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next-intl/client';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="mx-auto max-w-[1920px] px-6 bg-zinc-900">
      <div className="grid grid-cols-1 gap-8 py-12 text-white transition-colors duration-150 border-b lg:grid-cols-12 border-zinc-600 bg-zinc-900">
        <div className="col-span-1 lg:col-span-2">
          <Link
            href="/"
            className="flex items-center flex-initial font-bold md:mr-24"
          >
            <span className="mr-2 border rounded-full border-zinc-700">
              <Logo />
            </span>
            <span>ACME</span>
          </Link>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                {t('home')}
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                {t('about')}
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                {t('careers')}
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                {t('blog')}
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1 lg:col-span-2">
          <ul className="flex flex-col flex-initial md:flex-1">
            <li className="py-3 md:py-0 md:pb-4">
              <p className="font-bold text-white transition duration-150 ease-in-out hover:text-zinc-200">
                {t('legal')}
              </p>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                {t('privacyPolicy')}
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <Link
                href="/"
                className="text-white transition duration-150 ease-in-out hover:text-zinc-200"
              >
                {t('termsOfUse')}
              </Link>
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <LanguageSelector />
            </li>
            <li className="py-3 md:py-0 md:pb-4">
              <CurrencySelector />
            </li>
          </ul>
        </div>
        <div className="flex items-start col-span-1 text-white lg:col-span-6 lg:justify-end">
          <div className="flex items-center h-10 space-x-6">
            <a
              aria-label="Github Repository"
              href="https://github.com/rebillto/nextjs-subscription-payments/"
            >
              <GitHub />
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-between py-12 space-y-4 md:flex-row bg-zinc-900">
        <div>
          <span>
            &copy; {new Date().getFullYear()} ACME, Inc. All rights reserved.
          </span>
        </div>
        <div className="flex items-center">
          <span className="text-white">Crafted by</span>
          <a href="https://rebill.com" aria-label="Rebill.com Link">
            <img
              src="/rebill.svg"
              alt="Vercel.com Logo"
              className="inline-block h-6 ml-4 text-white"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

const LanguageSelector = () => {
  const router = useRouter();
  const pathName = usePathname();
  const locale = useLocale();
  const [selectedLanguage, setSelectedLanguage] = useState(locale);

  const handleLanguageChange = (event: any) => {
    event.preventDefault();
    setSelectedLanguage(event.target.value);
    const url = `${pathName}`;
    router.push(url, { locale: event?.target.value });
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={selectedLanguage}
        onChange={handleLanguageChange}
        className="border border-gray-300 rounded p-1 text-black"
      >
        <option value="en">EN</option>
        <option value="es">ES</option>
        <option value="pt">PT</option>
      </select>
    </div>
  );
};

const CurrencySelector = () => {
  const { data, updateData } = useStore();

  const handleCurrencyChange = (event: any) => {
    event.preventDefault();
    updateData({ currency: event.target.value });
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={data?.currency ? data?.currency : 'ARS'}
        onChange={handleCurrencyChange}
        className="border border-gray-300 rounded p-1 text-black"
      >
        <option value="ARS">ARS $</option>
        <option value="CLP">CLP $</option>
        <option value="COP">COP $</option>
        <option value="MXN">MXN $</option>
        {/* <option value="PEN">PEN S/</option> */}
        <option value="UYU">UYU $</option>
        <option value="USD">USD $</option>
        {/*  <option value="BRL">
          BRL $
        </option> */}
      </select>
    </div>
  );
};
