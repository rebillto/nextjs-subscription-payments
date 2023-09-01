'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {useTranslations, useLocale} from 'next-intl';

import Button from '@/components/ui/Button';
import { useStore } from '@/contexts/defaultStore';
import localizeCurrency from '@/helpers/localizeCurrency';

export default function Pricing({
  products,
}: Props) {

  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price: any) => price?.frequency?.type)
      )
    )
  );

  const { data, updateData } = useStore();
  const t = useTranslations('pricing');
  const router = useRouter();
  const { user } = useUser();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('months');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  
  const locale = useLocale();
  
  //todo change to oauth subscription user metadata
  const subscription = '';

  const handleCheckout = (price: any) => {
    setPriceIdLoading(price.id);
    updateData({
      selectedPriceId: price.id
    })
    if (!user) {
      return router.push('/signin');
    }
    if (subscription) {
      //todo create manage subscription flow. 
      return router.push('/account');
    }
    return router.push('/checkout')
  };

  if (!products.length)
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            {t("NoPlansFoundMessage")}
            <a
              className="text-pink-500 underline"
              href="http://dashboard.rebill.dev/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Rebill Dashboard
            </a>
            .
          </p>
        </div>
        <LogoCloud />
      </section>
    );

  if (products.length === 1)
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
              {t("PlansHeader")}
            </h1>
            <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
              {t("PlansDescription")}
            </p>
            <div className="relative flex self-center mt-12 border rounded-lg bg-zinc-900 border-zinc-800">
              <div className="border border-pink-500 border-opacity-50 divide-y rounded-lg shadow-sm bg-zinc-900 divide-zinc-600">
                <div className="p-6 py-2 m-1 text-2xl font-medium text-white rounded-md shadow-sm border-zinc-800 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8">
                  {products[0].item.name}
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-4 sm:mt-12 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
              {products[0].prices?.map((price: any) => {
                const priceString =
                  price.unit_amount &&
                  new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: price.currency!,
                    minimumFractionDigits: 0
                  }).format(price.amount);

                return (
                  <div
                    key={price.interval}
                    className="divide-y rounded-lg shadow-sm divide-zinc-600 bg-zinc-900"
                  >
                    <div className="p-6">
                      <p>
                        <span className="text-5xl font-extrabold white">
                          {priceString}
                        </span>
                        <span className="text-base font-medium text-zinc-100">
                          /{price.interval}
                        </span>
                      </p>
                      <p className="mt-4 text-zinc-300">{price.description}</p>
                      <Button
                        variant="slim"
                        type="button"
                        disabled={false}
                        loading={priceIdLoading === price.id}
                        onClick={() => handleCheckout(price)}
                        className="block w-full py-2 mt-12 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 "
                      >
                        {products[0].item.name === subscription
                           ? t("ManageButton")
                           : t("SubscribeButton")}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <LogoCloud />
        </div>
      </section>
    );

  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            {t("PlansHeader")}
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            {t("PlansDescription")}
          </p>
          <div className="relative self-center mt-6 bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
            {intervals.includes('months') && (
              <button
                onClick={() => setBillingInterval('months')}
                type="button"
                className={`${
                  billingInterval === 'months'
                    ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                {t("MonthlyBilling")}
              </button>
            )}
            {intervals.includes('years') && (
              <button
                onClick={() => setBillingInterval('years')}
                type="button"
                className={`${
                  billingInterval === 'years'
                    ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                    : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400'
                } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                {t("YearlyBilling")}
              </button>
            )}
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price: any) => (price.frequency.type === billingInterval && price.currency === data?.currency)
            );
            if (!price) return null;
            const priceString = localizeCurrency(price.amount, price.currency);
            return (
              <div
                key={product?.item.id}
                className={cn(
                  'rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
                  {
                    'border border-pink-500': subscription
                      ? product.item.name === subscription
                      : product.item.name === 'Freelancer'
                  }
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold leading-6 text-white">
                    {product.item.name}
                  </h2>
                  <p className="mt-4 text-zinc-300">{product.item.description}</p>
                  <p className="mt-8">
                    <span className="text-5xl font-extrabold white">
                      {priceString}
                    </span>
                    <span className="text-base font-medium text-zinc-100">
                      /{billingInterval}
                    </span>
                  </p>
                  <Button
                    variant="slim"
                    type="button"
                    disabled={!user}
                    loading={priceIdLoading === price.id}
                    onClick={() => handleCheckout(price)}
                    className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
                  >
                    {subscription ? t("ManageButton"): t("SubscribeButton")}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        <LogoCloud />
      </div>
    </section>
  );
}

function LogoCloud() {
  const t = useTranslations('pricing');

  return (
    <div>
      <p className="mt-24 text-xs uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">
        {t("BroughtToYouBy")}
      </p>
      <div className="flex flex-col items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-5">
        <div className="flex items-center justify-start">
          <a href="https://nextjs.org" aria-label="Next.js Link">
            <img
              src="/nextjs.svg"
              alt="Next.js Logo"
              className="h-12 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://vercel.com" aria-label="Vercel.com Link">
            <img
              src="/vercel.svg"
              alt="Vercel.com Logo"
              className="h-6 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://github.com" aria-label="github.com Link">
            <img
              src="/github.svg"
              alt="github.com Logo"
              className="h-8 text-white"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

interface Gateway {
  id: string;
  type: string;
  country: string;
  description: string;
  status: string;
  publicKey: string;
}

interface Frequency {
  type: string;
  quantity: number;
}

interface Price {
  id: string;
  gateway: Gateway;
  frequency: Frequency;
  repetitions: number;
  description: string;
  currency: string;
  enabled: boolean;
  priceSetting: any; // You can replace 'any' with the appropriate type if needed
  parent: any; // You can replace 'any' with the appropriate type if needed
  itemId: string;
  amount: string;
  type: string;
  debitDay: any; // You can replace 'any' with the appropriate type if needed
  debitType: any; // You can replace 'any' with the appropriate type if needed
}

interface Item {
  id: string;
  name: string;
  description: string;
  metadata: any; // You can replace 'any' with the appropriate type if needed
  createdAt: string;
  itemFamilyId: any; // You can replace 'any' with the appropriate type if needed
  enabled: boolean;
}

interface Product {
  item: Item;
  prices: Price[];
}

interface Props {
  products: Product[];
}

type BillingInterval = 'years' | 'months'; 