export type Product = {
  id: string; handle: string; title: string; description: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: { id: string; title: string; availableForSale: boolean }[] };
  tags?: string[];
};
export type CartLine = { id: string; quantity: number; merchandise: { id: string; title: string; product: { title: string; featuredImage?: { url: string } | null }; price: { amount: string; currencyCode: string } } };
