'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Menu, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { Product } from '@/lib/types';
const ImmersiveShowroom = dynamic(() => import('./ImmersiveShowroom'), {ssr:false, loading:()=> <div className="scroll-experience-fallback">YEVA — IMMERSIVE SHOWROOM</div>});
type Cart = {id:string;checkoutUrl:string;totalQuantity:number;lines:{nodes:{id:string;quantity:number;merchandise:{title:string;product:{title:string;featuredImage?:{url:string}|null};price:{amount:string;currencyCode:string}}}[]}};
const money=(amount:string,currency:string)=>new Intl.NumberFormat('en-IN',{style:'currency',currency,maximumFractionDigits:0}).format(Number(amount));

export default function Storefront(){
 const [products,setProducts]=useState<Product[]>([]); const [mode,setMode]=useState('loading');
 const [menuOpen,setMenuOpen]=useState(false); const [cartOpen,setCartOpen]=useState(false); const [cart,setCart]=useState<Cart|null>(null);
 const [busy,setBusy]=useState(false); const [notice,setNotice]=useState(''); const [activeColor,setActiveColor]=useState('All'); const [gender,setGender]=useState('All'); const [searchOpen,setSearchOpen]=useState(false); const [search,setSearch]=useState('');
 useEffect(()=>{fetch('/api/storefront').then(r=>r.json()).then(d=>{setProducts(d.products||[]);setMode(d.mode||'demo')}).catch(()=>setMode('demo'));try{const saved=localStorage.getItem('yeva-cart');if(saved)setCart(JSON.parse(saved));}catch{}},[]);
 useEffect(()=>{try{if(cart)localStorage.setItem('yeva-cart',JSON.stringify(cart));else localStorage.removeItem('yeva-cart');}catch{}},[cart]);
 const filtered=useMemo(()=>products.filter(p=>{
   const tags=(p.tags||[]).map(t=>t.trim().toLowerCase());
   const matchesGender=gender==='All'||tags.includes(gender.toLowerCase())||tags.includes('unisex');
   const matchesColor=activeColor==='All'||tags.includes(activeColor.toLowerCase());
   const searchable=`${p.title} ${p.description} ${tags.join(' ')}`.toLowerCase();
   return matchesGender&&matchesColor&&searchable.includes(search.trim().toLowerCase());
 }),[products,activeColor,gender,search]);
 const addToBag=async(p:Product)=>{
   const variant=p.variants?.nodes?.find(v=>v.availableForSale);
   if(!variant){setNotice('Connect your Shopify store and publish a product variant to enable checkout.');setTimeout(()=>setNotice(''),4500);return;}
   setBusy(true);try{const response=await fetch('/api/storefront',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(cart?{action:'cartLinesAdd',cartId:cart.id,lines:[{merchandiseId:variant.id,quantity:1}]}:{action:'cartCreate',lines:[{merchandiseId:variant.id,quantity:1}]})});const data=await response.json();if(!response.ok)throw new Error(data.error||'Could not add item.');setCart(data.cart);setCartOpen(true);}catch(e){setNotice(e instanceof Error?e.message:'Could not add item.');setTimeout(()=>setNotice(''),5000)}finally{setBusy(false)}
 };
 const changeLine=async(lineId:string,quantity:number)=>{if(!cart)return;setBusy(true);try{const action=quantity<1?'cartLinesRemove':'cartLinesUpdate';const payload=quantity<1?{action,cartId:cart.id,lineIds:[lineId]}:{action,cartId:cart.id,lines:[{id:lineId,quantity}]};const r=await fetch('/api/storefront',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const d=await r.json();if(!r.ok)throw new Error(d.error||'Could not update bag.');setCart(d.cart.totalQuantity?d.cart:null);}catch(e){setNotice(e instanceof Error?e.message:'Could not update bag.');setTimeout(()=>setNotice(''),4500)}finally{setBusy(false)}};
 const colors=[{name:'All',hex:'#d9d9df'},{name:'Navy',hex:'#202f58'},{name:'Charcoal',hex:'#55565d'},{name:'Brown',hex:'#493b38'},{name:'Black',hex:'#17171a'},{name:'Olive',hex:'#777a5b'}];
 const fallbackImage=(p:Product)=>{
   const tags=(p.tags||[]).map(t=>t.toLowerCase());
   if(tags.includes('charcoal'))return '/images/scrubs-charcoal.png';
   if(tags.includes('brown'))return '/images/scrubs-brown-navy.png';
   if(tags.includes('black'))return '/images/real-garments/yeva-scrub-stone.jpg';
   if(tags.includes('olive'))return '/images/real-garments/yeva-scrub-emerald.jpg';
   if(tags.includes('burgundy'))return '/images/real-garments/yeva-scrub-burgundy.jpg';
   return '/images/scrubs-navy.png';
 };
 return <main>
  <div className="announcement">WE ENGINEER COMFORT. WE DESIGN CONFIDENCE. <span>—</span> YEVAMED</div>
  <header className="site-header">
   <button className="icon-button mobile-menu" onClick={()=>setMenuOpen(!menuOpen)} aria-label="Toggle menu">{menuOpen?<X/>:<Menu/>}</button>
   <nav className={`nav-left ${menuOpen?'nav-open':''}`}><a href="#shop" onClick={()=>setGender('All')}>SHOP</a><a href="#shop" onClick={()=>setGender('Men')}>MEN</a><a href="#shop" onClick={()=>setGender('Women')}>WOMEN</a><a href="#fabric">FABRIC</a><a href="#carekits">CAREKITS</a><a href="#why">WHY YEVA</a><a href="#brand-assets">BRAND</a><a href="#story">OUR STORY</a></nav>
   <a className="brand-lockup" href="#top" aria-label="YEVA home"><Image src="/images/yeva-wordmark-white.png" alt="YEVA" width={138} height={49} className="wordmark-image"/></a>
   <div className="nav-right"><a href="#teams">TEAM ORDERS</a><button className="icon-button" aria-label="Search" onClick={()=>setSearchOpen(!searchOpen)}><Search size={18}/></button><button className="bag-button" onClick={()=>setCartOpen(true)}><ShoppingBag size={17}/><span>BAG ({cart?.totalQuantity||0})</span></button></div>
  </header>
  {searchOpen&&<div className="search-panel"><Search size={17}/><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search scrubs, fabric, care kits…"/><button onClick={()=>{setSearch('');setSearchOpen(false)}}><X size={17}/></button></div>}
  <ImmersiveShowroom/>
  <section className="manifesto" id="story"><div className="section-kicker">01 — THE YEVA POINT OF VIEW</div><div className="manifesto-grid"><h2>Made for the<br/><em>moments that matter.</em></h2><div><p>Long shifts. Small victories. The everyday work that changes lives. YEVA brings a considered point of view to the uniform — clean silhouettes, purposeful details and a palette made to feel like you.</p><a className="text-link" href="#fabric">GET TO KNOW YEVA <ArrowUpRight size={15}/></a></div></div></section>
  <section className="shop-section" id="shop"><div className="section-kicker">02 — THE COLLECTION <span>DESIGNED FOR EVERY SHIFT</span></div><div className="shop-heading"><div><h2>Find your <em>everyday.</em></h2><div className="gender-tabs">{['All','Men','Women'].map(g=><button key={g} className={gender===g?'active':''} onClick={()=>setGender(g)}>{g.toUpperCase()}</button>)}</div></div><div className="shop-filters"><span>SHOP BY COLOUR</span>{colors.map(c=><button key={c.name} title={c.name} aria-label={`Filter ${c.name}`} className={`swatch ${activeColor===c.name?'selected':''}`} style={{'--swatch':c.hex} as React.CSSProperties} onClick={()=>setActiveColor(c.name)}>{activeColor===c.name&&<Check size={12}/>}</button>)}</div></div>
   <div className="product-grid">{filtered.length?filtered.map((p,i)=>{const image=fallbackImage(p);return <article className="product-card" key={p.id}><div className="product-image-wrap"><span className="product-index">{String(i+1).padStart(2,'0')}</span><Image src={p.featuredImage?.url||image} alt={p.featuredImage?.altText||p.title} fill sizes="(max-width:700px) 90vw, 30vw" className="product-image" onError={event=>{event.currentTarget.src=image}}/><button className="quick-add" onClick={()=>addToBag(p)} disabled={busy}><Plus size={16}/> QUICK ADD</button></div><div className="product-meta"><div><h3><Link href={`/products/${p.handle}`}>{p.title}</Link></h3><p>{p.tags?.slice(0,2).join(' / ')||'THE YEVA COLLECTION'}</p></div><span>{mode==='shopify'?money(p.priceRange.minVariantPrice.amount,p.priceRange.minVariantPrice.currencyCode):'VIEW DETAILS'}</span></div></article>}) : <p className="empty-state">No products match that search. Try another colour or term.</p>}</div>
   <div className="collection-footer"><span>{mode==='shopify'?'LIVE SHOPIFY CATALOGUE':'COLLECTION PREVIEW — SHOPIFY NOT CONNECTED'}</span><a className="text-link" href="#teams">EXPLORE TEAM ORDERS <ArrowRight size={15}/></a></div>
  </section>
  <section className="fabric-section" id="fabric">
   <div className="fabric-art"><Image src="/images/brochure-p2-1.jpg" alt="YEVA medical scrub colours and fabric collection" fill sizes="(max-width:800px) 100vw, 48vw" className="fabric-photo"/><div className="fabric-art-shade"/><div className="fabric-center"><span>Y</span><small>YEVA / MATERIAL STUDY</small></div><span className="fabric-caption">FORM / FUNCTION / FEEL</span></div>
   <div className="fabric-copy"><div className="section-kicker">03 — FABRIC & FUNCTION</div><h2>We engineer<br/><em>comfort.</em></h2><p>Premium medical wear, made for those who care. Explore the YEVA fabric collections, each with its own balance of comfort, movement and everyday performance.</p>
    <div className="fabric-range">
     <article><div className="range-head"><span>01 / YEVA RYX</span><small>ADVANCED FABRIC. EXCEPTIONAL COMFORT.</small></div><p>Innovative performance fabric engineered to deliver superior comfort, flexibility and breathability for healthcare professionals and medical students.</p><p>YEVA FLEX combines a soft-touch feel with excellent stretch and lightweight comfort, allowing you to move freely throughout your day. Designed for demanding clinical environments, it helps maintain a fresh, professional appearance while providing lasting comfort.</p><div className="range-tags"><b>4-WAY STRETCH</b><b>ANTI-WRINKLE</b><b>SUSTAINABLE</b></div><small className="range-note">Feels Like: Cloud-Soft Comfort, Lightweight & Flexible.</small></article>
     <article><div className="range-head"><span>02 / YEVA LITE</span><small>LIGHTNESS YOU CAN FEEL. COMFORT YOU CAN TRUST.</small></div><p>Designed for healthcare professionals and medical students who value lightweight comfort, effortless movement and a clean professional look. A balance of softness, stretch and breathability — made to keep up with every move, every shift and every care moment.</p><div className="range-tags"><b>2-WAY STRETCH</b><b>ANTI-WRINKLE</b><b>SUSTAINABLE</b></div><ul className="range-list"><li>Feather-Light Comfort</li><li>Supreme Softness</li><li>Flexible Stretch</li><li>Enhanced Breathability</li><li>Wrinkle-Resistant Finish</li><li>Everyday Durability</li></ul><small className="range-note">Feel Light. Move Freely. Care Confidently.</small></article>
     <article><div className="range-head"><span>03 / YEVA CORE</span><small>ESSENTIAL COMFORT. EVERYDAY PERFORMANCE.</small></div><p>YEVA CORE brings essential comfort and everyday performance to medical wear.</p><div className="range-tags"><b>SUPER SOFT</b><b>BREATHABLE</b><b>FEATHERLIGHT</b></div></article>
    </div>
   </div>
  </section>
  <section className="carekit-section" id="carekits">
   <div className="carekit-intro"><div className="section-kicker">04 — YEVA CAREKIT</div><h2>Course-wise essentials.<br/><em>One complete solution.</em></h2><p>Every healthcare course has its own requirements. That’s why YEVA MED brings you carefully curated, course-specific medical kits designed to support your learning and clinical journey.</p><p>From your first practical class to professional training, get the essential instruments you need, all in one place.</p><a className="text-link" href="#teams">ENQUIRE ABOUT CAREKITS <ArrowUpRight size={15}/></a></div>
   <div className="carekit-visual"><Image src="/images/brochure-p1-1.jpg" alt="YEVA MED care kit box and stethoscope" fill sizes="(max-width:800px) 100vw, 45vw" className="carekit-product-image"/><div className="carekit-visual-caption"><span>YEVA MED / CAREKIT</span><b>Different courses.<br/>Different needs.<br/>One YEVA.</b></div></div>
   <div className="carekit-catalog">
    <div className="section-kicker">COURSE-WISE COLLECTIONS</div>
    <div className="carekit-grid">
     <article><span>01</span><h3>Nursing Care Kit</h3><ul><li>Stethoscope</li><li>BP apparatus</li><li>Pulse oximeter</li><li>Thermometer</li><li>Nursing scissors</li><li>Pen torch</li></ul></article>
     <article><span>02</span><h3>Physiotherapy Care Kit</h3><ul><li>Goniometer</li><li>Reflex hammer</li><li>Measuring tape</li><li>Tuning fork</li><li>Assessment tools</li></ul></article>
     <article><span>03</span><h3>Occupational Therapy Care Kit</h3><ul><li>Goniometer</li><li>Hand dynamometer</li><li>Reflex hammer</li><li>Sensory assessment tools</li><li>Measuring tape</li></ul></article>
     <article><span>04</span><h3>Medical Student Care Kit</h3><ul><li>Stethoscope</li><li>Pen torch</li><li>Diagnostic instruments</li><li>Medical scissors</li><li>Examination essentials</li></ul></article>
     <article><span>05</span><h3>Paramedical Care Kit</h3><ul><li>Course-specific diagnostic tools</li><li>Assessment instruments</li><li>Clinical accessories</li></ul></article>
     <article><span>06</span><h3>More course collections</h3><ul><li>Medical Laboratory Technology Kit</li><li>Radiology & Imaging Kit</li><li>Pharmacy Student Essentials</li></ul></article>
    </div>
    <div className="carekit-reasons"><b>WHY YEVA CAREKIT?</b><span>Course-specific instrument selection</span><span>Student-friendly collections</span><span>Quality-focused instruments</span><span>Organized & convenient packaging</span><span>Essential tools for practical learning</span></div>
   </div>
  </section>
  <section className="why-section" id="why">
   <div className="why-copy"><div className="section-kicker">05 — WHY YEVAMED?</div><h2>More than medical essentials.<br/><em>A standard of care.</em></h2><p>At YEVAMED, we understand that healthcare professionals need products they can rely on every single day. That’s why we bring together comfort, quality, functionality, and modern design to support every step of their professional journey.</p></div>
   <div className="why-grid">
    <article><span>01</span><h3>Quality You Can Trust</h3><p>Carefully selected materials and products designed with attention to quality, durability, and everyday performance.</p></article>
    <article><span>02</span><h3>Comfort Without Compromise</h3><p>Thoughtfully designed medical wear that supports comfort, flexibility, and ease of movement throughout long working hours.</p></article>
    <article><span>03</span><h3>Designed for Every Profession</h3><p>Dedicated medical essentials and course-specific kits for medical, nursing, physiotherapy, occupational therapy, and other paramedical students.</p></article>
    <article><span>04</span><h3>Modern & Professional Design</h3><p>Contemporary styles, practical details, and professional aesthetics that bring confidence to your everyday appearance.</p></article>
    <article><span>05</span><h3>Student-Friendly Value</h3><p>Our goal is to make quality medical essentials accessible without compromising on essential features.</p></article>
    <article><span>06</span><h3>Everything Under One Brand</h3><p>From medical scrubs and lab coats to instruments, student kits, and healthcare accessories — find your everyday essentials in one place.</p></article>
   </div>
  </section>
  <section className="about-section" id="story">
   <div className="about-image"><Image src="/images/brochure-p1-2.jpg" alt="YEVA MED healthcare professionals wearing medical scrubs" fill sizes="(max-width:800px) 100vw, 50vw" className="about-team-image"/><span>YEVA MED / THE PEOPLE BEHIND HEALTHCARE</span></div>
   <div className="about-copy"><div className="section-kicker">06 — ABOUT YEVA MED</div><h2>We design<br/><em>confidence.</em></h2><p>At YEVA MED, we believe that healthcare professionals deserve more than just medical essentials — they deserve quality, comfort, confidence, and innovation.</p><p>We are a medical wear and healthcare essentials brand dedicated to serving the needs of medical, paramedical, and allied healthcare students and professionals. From premium medical scrubs and lab coats to essential medical instruments and course-specific kits, we aim to bring everything healthcare learners need under one trusted brand.</p><p>Our mission is to combine modern design, functional performance, and accessible quality to make every healthcare professional feel confident in what they wear and use.</p><div className="commitment"><small>OUR COMMITMENT</small><b>We don’t just create products.<br/>We aim to support the people behind healthcare.</b></div></div>
  </section>
  <section className="brand-assets-section" id="brand-assets">
   <div className="brand-assets-heading">
    <div className="section-kicker">07 — THE YEVA IDENTITY</div>
    <h2>Care is in<br/><em>every detail.</em></h2>
    <p>From the first impression to the everyday shift, the YEVA identity brings our medical-wear world together.</p>
   </div>
   <div className="brand-assets-grid">
    <article className="brand-asset-card brand-card-identity">
     <div className="brand-asset-image brand-card-image">
      <Image src="/images/yeva-business-card-mockup.jpg" alt="YEVA navy and white business card mockups featuring the YEVA logo and medical stethoscope graphic" fill sizes="(max-width:750px) 100vw, 48vw" className="brand-card-photo"/>
     </div>
     <div className="brand-asset-caption"><div><span>01 / BRAND IDENTITY</span><h3>A mark of care.</h3><p>YEVA business-card identity in the signature navy and white palette.</p></div><b>YEVA®</b></div>
    </article>
    <article className="brand-asset-card brand-card-campaign">
     <div className="brand-asset-image campaign-image">
      <Image src="/images/yeva-shift-essentials-campaign.jpg" alt="YEVA shift essentials campaign featuring two healthcare professionals in black medical scrubs with everyday accessories" fill sizes="(max-width:750px) 100vw, 48vw" className="campaign-photo"/>
     </div>
     <div className="brand-asset-caption"><div><span>02 / CAMPAIGN VISUAL</span><h3>Your shift essentials.</h3><p>A campaign look celebrating the people and essentials behind every shift.</p></div><b>YEVAMED</b></div>
    </article>
   </div>
  </section>
  <section className="team-section" id="teams"><div className="team-inner"><div className="section-kicker">08 — FOR THE WHOLE TEAM</div><h2>Better together.<br/><em>Uniform by uniform.</em></h2><p>Building a consistent look for your clinic, practice or care team? Talk to us about team orders, medical wear and course-wise care kits.</p><a className="pill-link light" href="mailto:info@yavamed.com?subject=YEVA%20MED%20Enquiry">START AN ENQUIRY <ArrowUpRight size={15}/></a><div className="contact-details"><a href="tel:+919544044266">9544044266</a><a href="tel:+919633264851">9633264851</a><a href="mailto:info@yavamed.com">info@yavamed.com</a><span>Delhi, Mangalore & Bangalore</span></div></div><div className="team-mark"><Image src="/images/yeva-mark.png" alt="YEVA symbol" fill sizes="35vw"/></div></section>
  <footer className="footer"><div className="footer-top"><a className="brand-lockup footer-brand" href="#top"><Image src="/images/yeva-wordmark-white.png" alt="YEVA" width={138} height={49} className="wordmark-image"/></a><p>WE ENGINEER COMFORT.<br/>WE DESIGN CONFIDENCE.</p><div className="footer-links"><a href="#shop">SHOP</a><a href="#fabric">FABRIC TECHNOLOGY</a><a href="#carekits">YEVA CAREKIT</a><a href="#why">WHY YEVAMED</a><a href="#story">ABOUT YEVA MED</a><a href="mailto:info@yavamed.com">CONTACT</a><a href="tel:+919544044266">CALL YEVA MED</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} YEVA. ALL RIGHTS RESERVED.</span><span>www.yevamed.com · Delhi, Mangalore & Bangalore</span><a href="#top">BACK TO TOP ↑</a></div></footer>
  {notice&&<div className="toast" role="status">{notice}<button onClick={()=>setNotice('')}><X size={14}/></button></div>}
  {cartOpen&&<div className="drawer-backdrop" onClick={()=>setCartOpen(false)}><aside className="cart-drawer" onClick={e=>e.stopPropagation()}><div className="drawer-head"><h2>YOUR BAG <span>({cart?.totalQuantity||0})</span></h2><button onClick={()=>setCartOpen(false)} aria-label="Close bag"><X/></button></div>{cart?.lines.nodes.length?<><div className="cart-lines">{cart.lines.nodes.map(line=><div className="cart-line" key={line.id}><div className="cart-line-info"><b>{line.merchandise.product.title}</b><small>{line.merchandise.title}</small><div className="quantity-controls"><button disabled={busy} onClick={()=>changeLine(line.id,line.quantity-1)} aria-label="Decrease quantity"><Minus size={12}/></button><span>{line.quantity}</span><button disabled={busy} onClick={()=>changeLine(line.id,line.quantity+1)} aria-label="Increase quantity"><Plus size={12}/></button><button className="remove-line" disabled={busy} onClick={()=>changeLine(line.id,0)}>REMOVE</button></div></div><span>{money(line.merchandise.price.amount,line.merchandise.price.currencyCode)}</span></div>)}</div><a className="checkout-button" href={cart.checkoutUrl}>CHECKOUT <ArrowUpRight size={16}/></a><p className="drawer-note">Checkout securely with Shopify.</p></>:<div className="empty-cart"><ShoppingBag size={28}/><h3>Your bag is taking a breather.</h3><p>Explore the collection and find your everyday.</p><button className="pill-link" onClick={()=>{setCartOpen(false);document.getElementById('shop')?.scrollIntoView({behavior:'smooth'})}}>SHOP THE COLLECTION <ArrowRight size={15}/></button></div>}</aside></div>}
 </main>
}
