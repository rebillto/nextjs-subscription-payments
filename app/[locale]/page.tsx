import Pricing from '@/components/Pricing';
import products from '../../fixtures/responses.json';

export default async function PricingPage() {

  return (
    <Pricing
      products={products}
    />
  );
}
