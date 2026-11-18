import { NextRequest, NextResponse } from 'next/server';
import { demoProducts } from '@/lib/demo-products';

const endpoint = () => {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const version = process.env.SHOPIFY_API_VERSION || '2026-10';
  return domain ? `https://${domain}/api/${version}/graphql.json` : null;
};
async function shopify<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const url = endpoint();
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
  if (!url || !token) throw new Error('Shopify is not configured. Add the Storefront API credentials to .env.local.');
  const response = await fetch(url, { method:'POST', headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':token}, body:JSON.stringify({query,variables}), cache:'no-store' });
  const payload = await response.json();
  if (!response.ok || payload.errors?.length) throw new Error(payload.errors?.[0]?.message || 'Shopify request failed.');
  return payload.data as T;
}

const PRODUCT_QUERY = `query YevaProducts($first:Int!){ products(first:$first, sortKey:BEST_SELLING){ nodes { id handle title description featuredImage { url altText } priceRange { minVariantPrice { amount currencyCode } } variants(first:20){ nodes { id title availableForSale } } tags } } }`;
const CART_CREATE = `mutation YevaCartCreate($lines:[CartLineInput!]){ cartCreate(input:{lines:$lines}){ cart { id checkoutUrl totalQuantity lines(first:50){ nodes { id quantity merchandise { ... on ProductVariant { id title product { title featuredImage { url } } price { amount currencyCode } } } } } userErrors { message } } } }`;
const CART_UPDATE = `mutation YevaCartUpdate($cartId:ID!,$lines:[CartLineUpdateInput!]!){ cartLinesUpdate(cartId:$cartId,lines:$lines){ cart { id checkoutUrl totalQuantity lines(first:50){ nodes { id quantity merchandise { ... on ProductVariant { id title product { title featuredImage { url } } price { amount currencyCode } } } } } userErrors { message } } }`;
const CART_REMOVE = `mutation YevaCartRemove($cartId:ID!,$lineIds:[ID!]!){ cartLinesRemove(cartId:$cartId,lineIds:$lineIds){ cart { id checkoutUrl totalQuantity lines(first:50){ nodes { id quantity merchandise { ... on ProductVariant { id title product { title featuredImage { url } } price { amount currencyCode } } } } } userErrors { message } } }`;
const CART_ADD = `mutation YevaCartAdd($cartId:ID!,$lines:[CartLineInput!]!){ cartLinesAdd(cartId:$cartId,lines:$lines){ cart { id checkoutUrl totalQuantity lines(first:50){ nodes { id quantity merchandise { ... on ProductVariant { id title product { title featuredImage { url } } price { amount currencyCode } } } } } userErrors { message } } }`;

export async function GET(request: NextRequest) {
  const handle = request.nextUrl.searchParams.get('handle');
  if (!endpoint() || !process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    if (handle) return NextResponse.json({ product: demoProducts.find(p => p.handle === handle) || null, mode:'demo' });
    return NextResponse.json({ products: demoProducts, mode:'demo' });
  }
  try {
    if (handle) {
      const productQuery = `query YevaProduct($handle:String!){ product(handle:$handle){ id handle title description featuredImage { url altText } priceRange { minVariantPrice { amount currencyCode } } variants(first:30){ nodes { id title availableForSale } } tags } }`;
      const data = await shopify<{product:unknown|null}>(productQuery,{handle});
      return NextResponse.json({product:data.product,mode:'shopify'});
    }
    const data = await shopify<{products:{nodes:unknown[]}}>(PRODUCT_QUERY,{first:16});
    return NextResponse.json({products:data.products.nodes,mode:'shopify'});
  } catch (error) {
    if (handle) return NextResponse.json({product:demoProducts.find(p => p.handle === handle) || null,mode:'demo',warning:error instanceof Error ? error.message : 'Shopify unavailable'});
    return NextResponse.json({products:demoProducts,mode:'demo',warning:error instanceof Error ? error.message : 'Shopify unavailable'});
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (body.action === 'cartCreate') {
      const data = await shopify<any>(CART_CREATE,{lines:body.lines});
      const result = data.cartCreate;
      if (result.userErrors?.length) throw new Error(result.userErrors[0].message);
      return NextResponse.json({cart:result.cart});
    }
    if (body.action === 'cartLinesUpdate') {
      const data = await shopify<any>(CART_UPDATE,{cartId:body.cartId,lines:body.lines});
      const result = data.cartLinesUpdate;
      if (result.userErrors?.length) throw new Error(result.userErrors[0].message);
      return NextResponse.json({cart:result.cart});
    }
    if (body.action === 'cartLinesRemove') {
      const data = await shopify<any>(CART_REMOVE,{cartId:body.cartId,lineIds:body.lineIds});
      const result = data.cartLinesRemove;
      if (result.userErrors?.length) throw new Error(result.userErrors[0].message);
      return NextResponse.json({cart:result.cart});
    }
    if (body.action === 'cartLinesAdd') {
      const data = await shopify<any>(CART_ADD,{cartId:body.cartId,lines:body.lines});
      const result = data.cartLinesAdd;
      if (result.userErrors?.length) throw new Error(result.userErrors[0].message);
      return NextResponse.json({cart:result.cart});
    }
    return NextResponse.json({error:'Unsupported action.'},{status:400});
  } catch (error) {
    return NextResponse.json({error:error instanceof Error ? error.message : 'Request failed.'},{status:400});
  }
}
