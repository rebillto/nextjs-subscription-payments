import products from '../../fixtures/responses.json';
import Pricing from '@/components/Pricing';

export default async function PricingPage() {
  return <Pricing products={products} />;
}
