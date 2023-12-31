'use client';

import Button from '@/components/ui/Button';
import { useStore } from '@/contexts/defaultStore';
import { getCustomerSession } from '@/helpers/getCustomerSession';
import { getUserMetadata } from '@/helpers/getUserMetadata';
import localizeCurrency from '@/helpers/localizeCurrency';
import { useUser } from '@auth0/nextjs-auth0/client';
import cn from 'classnames';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Pricing({ products }: Props) {
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
  const { user, isLoading } = useUser();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('months');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();
  const locale = useLocale();
  const [loaded, setLoaded] = useState(false);

  const getSubscriptions = async (userId: string) => {
    await getUserMetadata(userId)
      .then(async (res) => {
        if ('user_metadata' in res) {
          let userInfo = res?.user_metadata.userInfo;
          if (!userInfo) {
            userInfo = {
              family_name: user?.family_name ?? '',
              given_name: user?.given_name ?? '',
              email: user?.email ?? ''
            };
            await fetch('/api/auth/user-metadata', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                auth0_user_id: user?.sub,
                metadata: {
                  userInfo
                }
              })
            })
              .then(() => {
                updateData({
                  userMetaData: { ...res?.user_metadata, userInfo }
                });
              })
              .catch((error) =>
                console.error('error updating user metadata ', error)
              );
          } else {
            updateData({
              userMetaData: { ...res?.user_metadata }
            });
          }
        } else {
          let userInfo = {
            family_name: user?.family_name ?? '',
            given_name: user?.given_name ?? '',
            email: user?.email ?? ''
          };
          await fetch('/api/auth/user-metadata', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              auth0_user_id: user?.sub,
              metadata: {
                userInfo
              }
            })
          })
            .then(() => {
              updateData({
                userMetaData: { userInfo }
              });
            })
            .catch((error) =>
              console.error('error updating user metadata ', error)
            );
          setLoaded(true);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (!data?.userMetaData?.userInfo && user?.sub && !isLoading) {
      getSubscriptions(user?.sub);
    }
  }, [data?.userMetaData, user?.sub, isLoading, locale]);

  const handleCheckout = async (price: any) => {
    setPriceIdLoading(price.id);
    updateData({
      selectedPriceId: price.id
    });
    if (!user) {
      return router.push('/signin');
    }
    if (
      data?.userMetaData?.rebill_item_id?.includes(price.id) ||
      data?.userMetaData?.rebill_item_id == price.id
    ) {
      const customerPortalLink = await getCustomerSession(
        data?.userMetaData?.rebill_user_id
      );
      if (customerPortalLink?.url) {
        setPriceIdLoading('');
        return window.open(customerPortalLink.url, '_blank');
      }
    } else {
      const { email, given_name, family_name } = data?.userMetaData?.userInfo;
      const organizationAlias =
        process?.env?.NEXT_PUBLIC_REBILL_ORGANIZATION_ALIAS;
      setPriceIdLoading('');
      const payLink = `https://pay.rebill.com/${organizationAlias}/price/${price.id}?auth_id=${user?.sub}&lang=${locale}&email=${email}&firstName=${given_name}&lastName=${family_name}`;
      return router.push(payLink);
    }
  };

  if (!products.length)
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            {t('NoPlansFoundMessage')}
            <a
              className="text-pink-500 underline"
              href="http://dashboard.rebill.com/"
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

  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            {t('PlansHeader')}
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            {t('PlansDescription')}
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
                {t('MonthlyBilling')}
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
                {t('YearlyBilling')}
              </button>
            )}
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price: any) =>
                price.frequency.type === billingInterval &&
                price.currency === data?.currency
            );
            if (!price) return null;
            const priceString = localizeCurrency(price.amount, price.currency);
            return (
              <div
                key={product?.item.id}
                className={cn(
                  'rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900',
                  {
                    'border border-pink-500':
                      data?.userMetaData?.rebill_item_id?.includes(price.id)
                        ? true
                        : false
                  }
                )}
              >
                <div className="p-6">
                  <h2 className="text-2xl font-semibold leading-6 text-white">
                    {product.item.name}
                  </h2>
                  <p className="mt-4 text-zinc-300">{price.description}</p>
                  <p className="mt-8">
                    <span className="text-5xl font-extrabold white">
                      {priceString}
                    </span>
                    <span className="text-base font-medium text-zinc-100">
                      /{t(billingInterval)}
                    </span>
                  </p>
                  <Button
                    variant="slim"
                    type="button"
                    disabled={!user}
                    loading={
                      (user && !data?.userMetaData && !loaded) ||
                      priceIdLoading === price.id
                    }
                    onClick={() => handleCheckout(price)}
                    className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
                  >
                    {data?.userMetaData?.rebill_item_id?.includes(price.id)
                      ? t('ManageButton')
                      : t('SubscribeButton')}
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
        {t('BroughtToYouBy')}
      </p>
      <div className="flex flex-col justify-center items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-5">
        <div className="flex items-center justify-center">
          <a href="https://nextjs.org" aria-label="Next.js Link">
            <img
              src="/nextjs.svg"
              alt="Next.js Logo"
              className="h-8 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-center">
          <a href="https://vercel.com" aria-label="Vercel.com Link">
            <img
              src="/vercel.svg"
              alt="Vercel.com Logo"
              className="h-8 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-center">
          <a href="https://github.com" aria-label="github.com Link">
            <img
              src="/github.png"
              alt="github.com Logo"
              className="h-8 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-center">
          <a href="https://auth0.com" aria-label="auth0.com Link">
            <img
              src="/auth0.png"
              alt="auth0.com Logo"
              className="h-8 text-white"
            />
          </a>
        </div>
        <div className="flex items-center justify-center">
          <a href="https://rebill.com" aria-label="rebill.com Link">
            <img
              src="/rebill.svg"
              alt="rebill.com Logo"
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
  priceSetting: any;
  parent: any;
  itemId: string;
  amount: string;
  type: string;
  debitDay: any;
  debitType: any;
}

interface Item {
  id: string;
  name: string;
  description: string;
  metadata: any;
  createdAt: string;
  itemFamilyId: any;
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
