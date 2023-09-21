'use client';

import Button from '@/components/ui/Button';

import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useStore } from '@/contexts/defaultStore';
import { getCustomerSession } from '@/helpers/getCustomerSession';

export default function ManageSubscriptionButton() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { data } = useStore();

  const redirectToCustomerPortal = async () => {
    try {
      const url = await getCustomerSession(
        data?.userMetaData?.rebill_user_id
      ).then(data => data?.url);
      router.push(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
  };

  return (
    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <p className="pb-4 sm:pb-0">Manage your subscription on Rebill.</p>
      <Button
        variant="slim"
        disabled={!isLoading && !user}
        onClick={redirectToCustomerPortal}
      >
        Open customer portal
      </Button>
    </div>
  );
}