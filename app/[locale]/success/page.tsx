'use client';

import { getSubscription } from "@/helpers/getSubscription";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react"; 

export default async function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const subscriptionId = searchParams.get('subscription_id');
  
  const [hasHandledSubscription, setHasHandledSubscription] = useState(false); 

  const handleSubscription = async (subscriptionId: string) => {
    try {
      setHasHandledSubscription(true);
      const subscriptionDetail = await getSubscription(subscriptionId);
      const rebill_user_id = subscriptionDetail?.invoices[0].buyer.customer.id;
      const rebill_item_id = subscriptionDetail?.price?.id;
      const auth0_user_id = subscriptionDetail?.metadataObject?.auth_id;

      await fetch("/api/auth/user-metadata", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          auth0_user_id: auth0_user_id,
          metadata: {
            rebill_user_id,
            rebill_item_id
          },
        }),
      });

      router.push("/");
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (subscriptionId && !hasHandledSubscription) {
      handleSubscription(subscriptionId);
    }
  }, [subscriptionId, hasHandledSubscription]);

  return (
    <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8 flex-col flex items-center">Loading...</div>
  );
}