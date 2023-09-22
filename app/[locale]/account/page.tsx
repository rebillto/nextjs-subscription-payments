'use client';

import ManageSubscriptionButton from './ManageSubscriptionButton';
import Button from '@/components/ui/Button';
import { useStore } from '@/contexts/defaultStore';
import { useUser } from '@auth0/nextjs-auth0/client';
import { redirect } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { getUserMetadata } from '@/helpers/getUserMetadata';

export default function Account() {
  const { user, isLoading } = useUser();
  const { data, updateData } = useStore();
  const t = useTranslations('account'); // Use 'en' as the default locale

  const getMetadata = async (userId: string) => {
    await getUserMetadata(userId)
      .then(async (res) => {
        if ('user_metadata' in res) {
          let userInfo = res?.user_metadata.userInfo;
          if (!userInfo) {
            return redirect('/');
          }else{
            updateData({
              userMetaData: { ...res?.user_metadata }
            });
          } 
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (!isLoading && !user ) {
      return redirect('/');
    }
    if(data && !data?.userMetaData && user?.sub){
      getMetadata(user?.sub)
    }
  }, [user, isLoading, data]);

  const updateName = async (formData: FormData) => {
    const newName = formData.get('name') as string;
    const lastName = formData.get('lastname') as string;
    const userInfo = {
      ...data?.userMetaData?.userInfo,
      given_name: newName,
      family_name: lastName
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
          userMetaData: { ...data?.userMetaData, userInfo }
        });
        window.alert(t('updateSuccess')); // Display translated message
      })
      .catch((error) => console.error(t('errorUpdatingMetadata'), error)); // Display translated error message
  };

  const updateEmail = async (formData: FormData) => {
    const newEmail = formData.get('email') as string;
    const userInfo = {
      ...data?.userMetaData?.userInfo,
      email: newEmail
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
          userMetaData: { ...data?.userMetaData, userInfo }
        });
        window.alert(t('updateSuccess')); 
      })
      .catch((error) => console.error(t('errorUpdatingMetadata'), error));
  };

  return (
    <section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            {t('pageTitle')}
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            {t('partneredWithRebill')}
          </p>
        </div>
      </div>
      <div className="p-4">
        {data?.userMetaData?.rebill_item_id && <HeadlessCard footer={<ManageSubscriptionButton />} />}
        <Card
          title={t('yourNameCardTitle')}
          description={t('yourNameCardDescription')}
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">{t('yourNameCardMaxLength')}</p>
              <Button
                variant="slim"
                type="submit"
                form="nameForm"
                disabled={false}
              >
                {t('updateNameButton')}
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form
              className="flex flex-col"
              id="nameForm"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                updateName(formData);
              }}
            >
              <input
                type="text"
                name="name"
                className="p-3 rounded-md bg-zinc-800 mb-4 md:w-1/2"
                defaultValue={data?.userMetaData?.userInfo?.given_name ?? ''}
                placeholder={t('firstNamePlaceholder')}
                maxLength={64}
              />
              <input
                type="text"
                name="lastname"
                className="p-3 rounded-md bg-zinc-800 md:w-1/2"
                defaultValue={data?.userMetaData?.userInfo?.family_name ?? ''}
                placeholder={t('lastNamePlaceholder')}
                maxLength={64}
              />
            </form>
          </div>
        </Card>
        <Card
          title={t('yourEmailCardTitle')}
          description={t('yourEmailCardDescription')}
          footer={
            <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                {t('yourEmailCardVerifyChange')}
              </p>
              <Button
                variant="slim"
                type="submit"
                form="emailForm"
                disabled={false}
              >
                {t('updateEmailButton')}
              </Button>
            </div>
          }
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form
              id="emailForm"
              onSubmit={(e) => {
                e.preventDefault();
                updateEmail(new FormData(e.target as HTMLFormElement));
              }}
            >
              <input
                type="text"
                name="email"
                className="w-1/2 p-3 rounded-md bg-zinc-800"
                defaultValue={data?.userMetaData?.userInfo?.email ?? ''}
                placeholder={t('emailPlaceholder')}
                maxLength={64}
              />
            </form>
          </div>
        </Card>
      </div>
    </section>
  );
}

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
}

interface PropsHeadless {
  footer: ReactNode;
}

function HeadlessCard({ footer }: PropsHeadless) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
      <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}

function Card({ title, description, footer, children }: Props) {
  return (
    <div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
        {footer}
      </div>
    </div>
  );
}
