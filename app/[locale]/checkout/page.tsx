'use client';

import { useStore } from "@/contexts/defaultStore";
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const organization_id = process?.env?.NEXT_PUBLIC_REBILL_ORG_ID;
const api_key = process?.env?.NEXT_PUBLIC_REBILL_API_KEY;
const api_url = process?.env?.NEXT_PUBLIC_REBILL_API_URL;

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
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if(!data?.selectedPriceId){
      router.push("/");
    }
  }, [data])

  const handleSuccess = async (transactionResponse: SuccessfulResponse) => {
    await fetch("/api/auth/update-user-metadata", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auth0_user_id: user?.sub,
        metadata: {
          rebill_user_id: transactionResponse?.invoice.buyer.customer.id,
          rebill_item_id: data?.selectedPriceId
        },
      }),
    })
    .then(res => res)
    .catch(error => console.log(error));
  }

  const sdkLoad = () => {
      const initialization = {
        organization_id,
        api_key,
        api_url
      }

      const rebill_checkout =  new window.Rebill.PhantomSDK(initialization);
      rebill_checkout.setCustomer(customer);
      rebill_checkout.setCardHolder(cardHolder);
      rebill_checkout.setTransaction(transaction).then((price_setting: any) => console.log({price_setting}))
      rebill_checkout.setCallbacks({
        onSuccess: (response: SuccessfulResponse | FailedTransactionResponse) => {
          if('invoice' in response && response?.invoice){
            handleSuccess(response);
          }else{
            //Make something with failed transactions. 
            console.log()
          }
        },
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

interface PaymentGateway {
  id: string;
  type: string;
  country: string;
  description: string;
  status: string;
  publicKey: string;
  recurring: boolean;
  crossborder: boolean;
}

interface Payment {
  amount: string;
  id: string;
  currency: string;
  status: string;
  gateway: PaymentGateway;
  createdAt: string;
  source: string;
  errorMessage?: string; // Optional for failed transactions
}

interface Price {
  id: string;
  quantity: number;
}

interface Buyer {
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    cellPhone: string;
    birthday: string;
    taxIdType: string;
    taxIdNumber: string;
    personalIdType: string;
    personalIdNumber: string;
    userEmail: string;
    address: {
      street: string;
      city: string;
      state: string;
      country: string;
      zipCode: string;
      number: string;
      floor: string;
      apt: string;
      description: string;
    };
  };
  card: {
    id: string;
    bin: number;
    last4: string;
    cardHolder: string;
    cardNumber: string;
    expiration: {
      month: number;
      year: string;
    };
  };
}

interface SuccessfulResponse {
  invoice: {
    id: string;
    cartId: string;
    organizationId: string;
    paidBags: {
      payment: Payment;
      prices: Price[];
      schedules: string[];
    }[];
    buyer: Buyer;
    type: string;
    createdAt: string;
  };
  pendingTransaction: null;
  failedTransaction: null;
}

interface FailedTransactionResponse {
  id: string;
  cartId: string;
  organizationId: string;
  paidBags: {
    payment: Payment;
    prices: Price[];
    schedules: string[];
  }[];
  buyer: Buyer;
  type: string;
  createdAt: string;
}

/*
//Succesfull response

{
    "invoice": {
        "id": "c9339a78-ef9d-4897-9bf8-40e55f0735a3",
        "cartId": "d40c6837-0c79-4c36-b077-ae755382d147",
        "organizationId": "0a6a53ce-1220-47f9-b024-e61da6d41483",
        "paidBags": [
            {
                "payment": {
                    "amount": "7000",
                    "id": "0505142c-af41-41a6-9db8-43a2f1cc4e73",
                    "currency": "ARS",
                    "status": "SUCCEEDED",
                    "gateway": {
                        "id": "a32a7858-3b3c-438f-8279-12810b4dbc59",
                        "type": "rebill_gateway",
                        "country": "I",
                        "description": "Sandbox",
                        "status": "ACCEPTED",
                        "publicKey": "k-eFyvBF_eCtU46H5TOB02_I56ONV7HQ",
                        "recurring": true,
                        "crossborder": true
                    },
                    "createdAt": "2023-09-08T20:27:21.077Z",
                    "source": "FIRST"
                },
                "prices": [
                    {
                        "id": "03e15d9f-6de9-49e8-92d0-a2195d588a03",
                        "quantity": 1
                    }
                ],
                "schedules": [
                    "5b11442c-e327-47d6-97dd-8d891bc5c561"
                ]
            }
        ],
        "buyer": {
            "customer": {
                "id": "1ad634e0-3115-4a8e-b91a-d12f3079a850",
                "firstName": "German Gerardo",
                "lastName": "Guerci",
                "cellPhone": "54-2257636857",
                "birthday": "12-12-1996",
                "taxIdType": "CUIT",
                "taxIdNumber": "20401306286",
                "personalIdType": "DNI",
                "personalIdNumber": "40130628",
                "userEmail": "john@doe.com",
                "address": {
                    "street": "Blanco encalada",
                    "city": "Mar de ajo",
                    "state": "Buenos Aires",
                    "country": "AR",
                    "zipCode": "7109",
                    "number": "600",
                    "floor": "2",
                    "apt": "B",
                    "description": "Home / Office"
                }
            },
            "card": {
                "id": "44154d3c-5b6d-4229-aa22-c4de390d3b9b",
                "bin": 529991,
                "last4": "0015",
                "cardHolder": "German Gerardo Guerci",
                "cardNumber": "529991bx_836a306afeb944119d7ec66cbf2a18aa_bx0015",
                "expiration": {
                    "month": 8,
                    "year": "2030"
                }
            }
        },
        "type": "invoice",
        "createdAt": "2023-09-08T20:27:21.092Z"
    },
    "pendingTransaction": null,
    "failedTransaction": null
}


//failed transaction

{
    "id": "ae3b289a-5d22-433c-91e5-0f06eaa6db6d",
    "cartId": "b8f3c5ed-c136-443d-ac90-fc328b3e6441",
    "organizationId": "0a6a53ce-1220-47f9-b024-e61da6d41483",
    "paidBags": [
        {
            "payment": {
                "amount": "7000",
                "id": "56d05c91-efba-4709-b24c-f58dfb584c03",
                "currency": "ARS",
                "status": "FAILED",
                "gateway": {
                    "id": "a32a7858-3b3c-438f-8279-12810b4dbc59",
                    "type": "rebill_gateway",
                    "country": "I",
                    "description": "Sandbox",
                    "status": "ACCEPTED",
                    "publicKey": "k-eFyvBF_eCtU46H5TOB02_I56ONV7HQ",
                    "recurring": true,
                    "crossborder": true
                },
                "errorMessage": "The gateway can't create your customer card. Reason: the card was not accepted by the acquirer",
                "createdAt": "2023-09-08T20:43:36.076Z",
                "source": "FIRST"
            },
            "prices": [
                {
                    "id": "03e15d9f-6de9-49e8-92d0-a2195d588a03",
                    "quantity": 1
                }
            ],
            "schedules": []
        }
    ],
    "buyer": {
        "customer": {
            "id": "1ad634e0-3115-4a8e-b91a-d12f3079a850",
            "firstName": "German Gerardo",
            "lastName": "Guerci",
            "cellPhone": "54-2257636857",
            "birthday": "12-12-1996",
            "taxIdType": "CUIT",
            "taxIdNumber": "20401306286",
            "personalIdType": "DNI",
            "personalIdNumber": "40130628",
            "userEmail": "john@doe.com",
            "address": {
                "street": "Blanco encalada",
                "city": "Mar de ajo",
                "state": "Buenos Aires",
                "country": "AR",
                "zipCode": "7109",
                "number": "600",
                "floor": "2",
                "apt": "B",
                "description": "Home / Office"
            }
        },
        "card": {
            "id": "63eb5b7a-bc5c-4642-8350-c8afb5380fb3",
            "bin": 518605,
            "last4": "0568",
            "cardHolder": "German Gerardo Guerci",
            "cardNumber": "518605bx_3de5208e75fc404e9b690b263c70b0c4_bx0568",
            "expiration": {
                "month": 10,
                "year": "2029"
            }
        }
    },
    "type": "failed_transaction",
    "createdAt": "2023-09-08T20:43:36.083Z"
}
*/