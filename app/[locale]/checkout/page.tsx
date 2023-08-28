'use client';

import { useStore } from "@/contexts/defaultStore";

declare global {
  interface Window {
    Rebill: any;
  }
}

const customer = {
  firstName: "German Gerardo",
  lastName: "Guerci",
  email: 'john@doe.com',
  phone: {
    countryCode: "54",
    areaCode: "2257",
    phoneNumber: "636857"
  },
  birthday: "12-12-1996",
  taxId: {
    type: "CUIT",
    value: "20401306286"
  },
  personalId: {
    type: "DNI",
    value: "40130628"
  },
  address: {
    street: "Blanco encalada",
    number: "600",
    floor: "2",
    apt: "B",
    city: "Mar de ajo",
    state: "Buenos Aires",
    zipCode: "7109",
    country: "AR",
    description: "Home / Office"
  }
}

const cardHolder = {
  name: 'German Gerardo Guerci',
  identification: {
    type: 'DNI',
    value: '40130628',
  },
}

const transaction = {
  prices: [
     {
         id: "03e15d9f-6de9-49e8-92d0-a2195d588a03",
         quantity: 1,
     },
  ],
}

export default function Checkout() {
  const { data } = useStore(); 
  const sdkLoad = () => {
      const initialization = {
        organization_id: '0a6a53ce-1220-47f9-b024-e61da6d41483' /* your organization ID */,
        api_key: 'API_KEY_e6360079-7723-48dd-b2df-bc00cce48b2d',
        api_url: 'https://api.rebill.dev/v2' /* Rebill API target */,
      }

      const rebill_checkout =  new window.Rebill.PhantomSDK(initialization);
      rebill_checkout.setCustomer(customer);
      rebill_checkout.setCardHolder(cardHolder);
      rebill_checkout.setTransaction(transaction).then((price_setting: any) => console.log({price_setting}))
      rebill_checkout.setCallbacks({
        onSuccess: (response:any) => console.log("resp: ", response),
        onError: (error: any) => console.error("error: ", error)
      });

      rebill_checkout.setStyles({
        card_form: {
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 'none',
        },
        button: {
          base: {
            alignSelf: 'center',
            width: 100,
            color: 'red',
          },
          logo: false,
        },
        fieldWrapper: {
          base: { display: 'flex', fontSize: 14 },
        },
        inputWrapper: {
          base: { height: 36 },
        },
        input: {
          base: { backgroundColor: 'transparent' },
          cardNumber: { flex: 2 },
          expiryDate: { flex: 1, maxWidth: 60 },
          cvc: { flex: 1, maxWidth: 40 },
        },
        errorText: {
          base: { textAlign: 'center' },
        },
      })


      rebill_checkout.setText({
        card_number: 'Card Number',
        pay_button: 'Pay',
        error_messages: {
          emptyCardNumber: 'Enter a card number',
          invalidCardNumber: 'Card number is invalid',
          emptyExpiryDate: 'Enter an expiry date',
          monthOutOfRange: 'Expiry month must be between 01 and 12',
          yearOutOfRange: 'Expiry year cannot be in the past',
          dateOutOfRange: 'Expiry date cannot be in the past',
          invalidExpiryDate: 'Expiry date is invalid',
          emptyCVC: 'Enter a CVC',
          invalidCVC: 'CVC is invalid',
        },
      });
    
      rebill_checkout.setElements('rebill_elements');
  }
    
  return (
    <section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8 bg-slate-400 flex-col flex items-center">
        <h1 onClick={() => {
        sdkLoad(); 
        }}>
          {data?.selectedPriceId}
        </h1>
        <div id="rebill_elements"></div>
      </div>
    </section>
  );
}