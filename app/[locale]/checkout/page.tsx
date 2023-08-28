'use client';

import { useStore } from "@/contexts/defaultStore";

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

/*
//Succesfull response
{
  "invoice": null,
  "pendingTransaction": null,
  "failedTransaction": {
      "id": "1853223c-7df7-4d2d-b481-56573fd077da",
      "cartId": "07658829-ba0b-4438-8e84-b6b325e5697a",
      "organizationId": "0a6a53ce-1220-47f9-b024-e61da6d41483",
      "paidBags": [
          {
              "payment": {
                  "amount": "7000",
                  "id": "f4e069e1-e9e2-44a1-9720-bace84b004cd",
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
                  "errorMessage": "Error message should be defined",
                  "createdAt": "2023-08-28T15:31:31.112Z",
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
      "type": "failed_transaction",
      "createdAt": "2023-08-28T15:31:31.131Z"
  }
} */