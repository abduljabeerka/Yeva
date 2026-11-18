'use client';
import { useState } from 'react';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
export default function ProductPurchase({product}:{product:Product}){
 const [variant,setVariant]=useState(product.variants?.nodes?.find(v=>v.availableForSale)?.id||'');const [message,setMessage]=useState('');const [busy,setBusy]=useState(false);
 async function add(){if(!variant){setMessage('No available size or variant is published for this product yet.');return;}setBusy(true);try{const r=await fetch('/api/storefront',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'cartCreate',lines:[{merchandiseId:variant,quantity:1}]})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Unable to create cart.');window.location.href=d.cart.checkoutUrl;}catch(e){setMessage(e instanceof Error?e.message:'Unable to add product.');}finally{setBusy(false)}}
 return <div className="purchase-box"><label htmlFor="variant-select">SELECT SIZE / VARIANT</label><select id="variant-select" value={variant} onChange={e=>setVariant(e.target.value)}><option value="">Choose an option</option>{product.variants?.nodes?.map(v=><option key={v.id} value={v.id} disabled={!v.availableForSale}>{v.title}{!v.availableForSale?' — SOLD OUT':''}</option>)}</select><button className="purchase-button" onClick={add} disabled={busy}>{busy?'CONNECTING…':'ADD TO BAG'} <ShoppingBag size={16}/></button>{message&&<p className="purchase-message" role="status">{message}</p>}<p className="purchase-secure">SECURE CHECKOUT POWERED BY SHOPIFY <ArrowUpRight size={12}/></p></div>
}
