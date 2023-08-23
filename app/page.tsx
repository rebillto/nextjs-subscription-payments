import Pricing from '@/components/Pricing';
import products from '../fixtures/responses.json';

export default async function PricingPage() {


  return (
    <Pricing
      products={products}
    />
  );
}

//todo clean mock products stripe. 
const mockProductsStripe = [
  {
      "id": "prod_OQ2GGiSkBTo81w",
      "active": true,
      "name": "Hobby",
      "description": "Hobby product description",
      "image": null,
      "metadata": {},
      "prices": [
          {
              "id": "price_1NdCBkF7y5XuxpCA1iHv85Wv",
              "product_id": "prod_OQ2GGiSkBTo81w",
              "active": true,
              "description": null,
              "unit_amount": 1000,
              "currency": "usd",
              "type": "recurring",
              "interval": "month",
              "interval_count": 1,
              "trial_period_days": null,
              "metadata": {}
          },
          {
              "id": "price_1NdCBlF7y5XuxpCA7HTcDfm2",
              "product_id": "prod_OQ2GGiSkBTo81w",
              "active": true,
              "description": null,
              "unit_amount": 10000,
              "currency": "usd",
              "type": "recurring",
              "interval": "year",
              "interval_count": 1,
              "trial_period_days": null,
              "metadata": {}
          }
      ]
  },
  {
      "id": "prod_OQ2GDukOFhbPFP",
      "active": true,
      "name": "Freelancer",
      "description": "Freelancer product description",
      "image": null,
      "metadata": {},
      "prices": [
          {
              "id": "price_1NdCBmF7y5XuxpCAxnQ9Se3r",
              "product_id": "prod_OQ2GDukOFhbPFP",
              "active": true,
              "description": null,
              "unit_amount": 2000,
              "currency": "usd",
              "type": "recurring",
              "interval": "month",
              "interval_count": 1,
              "trial_period_days": null,
              "metadata": {}
          },
          {
              "id": "price_1NdCBnF7y5XuxpCAgLoW3sbL",
              "product_id": "prod_OQ2GDukOFhbPFP",
              "active": true,
              "description": null,
              "unit_amount": 20000,
              "currency": "usd",
              "type": "recurring",
              "interval": "year",
              "interval_count": 1,
              "trial_period_days": null,
              "metadata": {}
          }
      ]
  },
  {
      "id": "prod_OQ28BF2uFbodIS",
      "active": true,
      "name": "Freelancer",
      "description": "Freelancer product description",
      "image": null,
      "metadata": {},
      "prices": [
          {
              "id": "price_1NdC4QF7y5XuxpCAuLowBYy6",
              "product_id": "prod_OQ28BF2uFbodIS",
              "active": true,
              "description": null,
              "unit_amount": 2000,
              "currency": "usd",
              "type": "recurring",
              "interval": "month",
              "interval_count": 1,
              "trial_period_days": null,
              "metadata": {}
          },
          {
              "id": "price_1NdC4QF7y5XuxpCAMOJLR2L5",
              "product_id": "prod_OQ28BF2uFbodIS",
              "active": true,
              "description": null,
              "unit_amount": 20000,
              "currency": "usd",
              "type": "recurring",
              "interval": "year",
              "interval_count": 1,
              "trial_period_days": null,
              "metadata": {}
          }
      ]
  },
  {
      "id": "prod_OQ28ZSsWppU0FW",
      "active": true,
      "name": "Hobby",
      "description": "Hobby product description",
      "image": null,
      "metadata": {},
      "prices": [
          {
              "id": "price_1NdC4OF7y5XuxpCApuFOJdyu",
              "product_id": "prod_OQ28ZSsWppU0FW",
              "active": true,
              "description": null,
              "unit_amount": 1000,
              "currency": "usd",
              "type": "recurring",
              "interval": "month",
              "interval_count": 1,
              "trial_period_days": null,
              "metadata": {}
          },
          {
              "id": "price_1NdC4OF7y5XuxpCAtokUNqZw",
              "product_id": "prod_OQ28ZSsWppU0FW",
              "active": true,
              "description": null,
              "unit_amount": 10000,
              "currency": "usd",
              "type": "recurring",
              "interval": "year",
              "interval_count": 1,
              "trial_period_days": null,
              "metadata": {}
          }
      ]
  }
]