'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { 
  ArrowRight, ArrowUpRight, Check, ChevronDown, Menu, Minus, Phone, 
  Plus, Search, ShoppingBag, Sparkles, X, Sliders, ShieldCheck, Heart 
} from 'lucide-react';
import HeroCarousel from './HeroCarousel';
import ThreePillarsSection from './ThreePillarsSection';
import ShopByColorSection from './ShopByColorSection';
import ShopBestsellersSection from './ShopBestsellersSection';
import ElasticFrameShowcase from './ElasticFrameShowcase';
import CustomerReviewsSection from './CustomerReviewsSection';
import BalanceSections from './BalanceSections';

export interface CartItem {
  id: string;
  title: string;
  price: string;
  color: string;
  size: string;
  image: string;
  quantity: number;
}

export default function Storefront() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState('');
  
  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('yeva-unified-cart');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [
      {
        id: 'initial-demo-1',
        title: 'Men Eco Tech 5 Pocket Tuck In Midnight Blue Scrubs',
        price: 'Rs. 2,595',
        color: 'Midnight Blue',
        size: 'M',
        image: '/images/bestsellers/bestseller-1.jpg',
        quantity: 1
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('yeva-unified-cart', JSON.stringify(cartItems));
    } catch {}
  }, [cartItems]);

  const totalQuantity = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => {
      const num = parseInt(item.price.replace(/[^0-9]/g, ''), 10) || 0;
      return acc + (num * item.quantity);
    }, 0);
  }, [cartItems]);

  const handleAddToCart = (newItem: { title: string; price: string; color: string; size: string; image: string }) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.title === newItem.title && i.color === newItem.color && i.size === newItem.size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          id: `${Date.now()}-${Math.random()}`,
          ...newItem,
          quantity: 1
        }
      ];
    });

    setNotice(`Added ${newItem.title} (${newItem.size}) to your bag!`);
    setTimeout(() => setNotice(''), 3500);
    setCartOpen(true);
  };

  const updateItemQty = (id: string, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <main className="yeva-storefront-root" id="top">
      {/* Top Announcement Bar */}
      <div className="site-announcement-bar">
        <div className="announcement-content">
          <span>WE ENGINEER COMFORT. WE DESIGN CONFIDENCE.</span>
          <span className="announcement-dot">·</span>
          <span>FREE SHIPPING ACROSS INDIA ON ALL PREPAID ORDERS</span>
          <span className="announcement-dot">·</span>
          <span>EASY 7-DAY SIZE EXCHANGE</span>
        </div>
      </div>

      {/* Sticky Main Navigation: Properly Rearranged Layout */}
      <header className="site-main-header">
        <div className="header-inner-rearranged">
          {/* 1. Left: Brand Logo Lockup & Mobile Toggle */}
          <div className="header-brand-cluster">
            <button
              type="button"
              className="icon-button mobile-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <Link href="#top" className="brand-logo-link" aria-label="YEVA Home">
              <Image
                src="/images/yeva-wordmark.png"
                alt="YEVA MED"
                width={132}
                height={44}
                priority
                className="brand-logo-img"
              />
            </Link>
          </div>

          {/* 2. Center: Properly Arranged Desktop Navigation Links */}
          <nav className="header-center-nav">
            <a href="#bestsellers" className="nav-link">BESTSELLERS</a>
            <a href="#shop-by-color" className="nav-link">SHOP BY COLOR</a>
            <a href="#three-pillars" className="nav-link">SEDESCOPES</a>
            <a href="#three-pillars" className="nav-link">CAREKITS</a>
            <a href="#elastic-cards" className="nav-link nav-highlight">
              <Sparkles size={12} className="nav-sparkle-icon" />
              <span>ELASTIC CARDS</span>
            </a>
            <a href="#reviews" className="nav-link">REVIEWS (10K+)</a>
            <a href="#fabric-tech" className="nav-link">FABRIC TECH</a>
            <a href="#teams" className="nav-link">TEAM ORDERS</a>
          </nav>

          {/* 3. Right: Utility & Customer Action Cluster */}
          <div className="header-actions-cluster">
            <a href="tel:+919544044266" className="header-helpline-pill" title="Clinical Helpline">
              <Phone size={13} />
              <span>9544044266</span>
            </a>

            <button
              type="button"
              className="header-icon-action"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Search medical wear"
              title="Search"
            >
              <Search size={18} />
            </button>

            <button
              type="button"
              className="header-bag-action"
              onClick={() => setCartOpen(true)}
              aria-label="Open medical bag"
            >
              <ShoppingBag size={17} />
              <span className="bag-label-text">BAG</span>
              <span className="bag-counter-bubble">{totalQuantity}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-Out Navigation Drawer */}
      {menuOpen && (
        <div className="mobile-drawer-backdrop" onClick={() => setMenuOpen(false)}>
          <aside className="mobile-nav-drawer" onClick={e => e.stopPropagation()}>
            <div className="mobile-drawer-head">
              <Image
                src="/images/yeva-wordmark.png"
                alt="YEVA"
                width={120}
                height={40}
                className="mobile-drawer-logo"
              />
              <button
                type="button"
                className="mobile-drawer-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mobile-drawer-links">
              <div className="drawer-group-title">CLINICAL COLLECTIONS</div>
              <a href="#bestsellers" onClick={() => setMenuOpen(false)}>Shop Bestsellers</a>
              <a href="#shop-by-color" onClick={() => setMenuOpen(false)}>Shop by Color (Flat-Lay)</a>
              <a href="#three-pillars" onClick={() => setMenuOpen(false)}>Acoustic Sedescopes</a>
              <a href="#three-pillars" onClick={() => setMenuOpen(false)}>Course-Wise CareKits</a>
              <a href="#elastic-cards" onClick={() => setMenuOpen(false)} className="drawer-highlight-link">
                <Sparkles size={14} />
                <span>Elastic Card Physics</span>
              </a>

              <div className="drawer-group-title">INNOVATION & EVIDENCE</div>
              <a href="#reviews" onClick={() => setMenuOpen(false)}>Verified Reviews (10,615+)</a>
              <a href="#fabric-tech" onClick={() => setMenuOpen(false)}>Fabric Technology (RYX / LITE)</a>
              <a href="#why-yeva" onClick={() => setMenuOpen(false)}>Why Healthcare Trusts YEVA</a>
              <a href="#teams" onClick={() => setMenuOpen(false)}>Hospital & Team Orders</a>
              <a href="#faq" onClick={() => setMenuOpen(false)}>Frequently Asked Questions</a>
            </div>

            <div className="mobile-drawer-footer">
              <a href="tel:+919544044266" className="mobile-helpline-cta">
                <Phone size={15} />
                <span>Call Helpline: +91 95440 44266</span>
              </a>
              <small>Serving Delhi · Mangalore · Bangalore</small>
            </div>
          </aside>
        </div>
      )}

      {/* Search Drawer Panel */}
      {searchOpen && (
        <div className="search-drop-panel">
          <div className="search-panel-inner">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              autoFocus
              placeholder="Search medical scrubs, stethoscopes, carekits, colors, fabric..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="search-close-btn"
              onClick={() => {
                setSearchQuery('');
                setSearchOpen(false);
              }}
              aria-label="Close search"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 1. TOP SECTION: Hero Carousel (CodePen Expanding Horizontal Carousel - 3D Removed) */}
      <HeroCarousel />

      {/* 2. SECOND SECTION: 3 Columns (Sedescope, Scrub, CareKit - with ElasticFrame effects!) */}
      <ThreePillarsSection />

      {/* 3. THIRD SECTION: Color-wise showing scrub photo and their details */}
      <ShopByColorSection onAddToCart={handleAddToCart} />

      {/* 4. FOURTH SECTION: Shop for Best Seller */}
      <ShopBestsellersSection onAddToCart={handleAddToCart} />

      {/* 5. INTERACTIVE ELASTIC FRAME CARD EFFECT SHOWCASE (Scrolltide Interactive Membrane Effect) */}
      <ElasticFrameShowcase onAddToCart={handleAddToCart} />

      {/* 6. FIFTH SECTION: Customer Review and Feedback */}
      <CustomerReviewsSection />

      {/* 7. BALANCE SECTION: Fabric Tech, Why Choose YEVA, Team Orders, FAQ, Newsletter, Luxury Footer */}
      <BalanceSections />

      {/* Live Toast Notification */}
      {notice && (
        <div className="site-toast-notice" role="status">
          <Sparkles size={16} />
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Sliding Cart Drawer */}
      {cartOpen && (
        <div className="cart-backdrop" onClick={() => setCartOpen(false)}>
          <aside className="cart-slide-drawer" onClick={e => e.stopPropagation()}>
            <div className="drawer-header">
              <div className="drawer-title-row">
                <ShoppingBag size={19} />
                <h3>YOUR MEDICAL BAG</h3>
                <span className="drawer-count-tag">({totalQuantity} Items)</span>
              </div>
              <button
                type="button"
                className="drawer-close-btn"
                onClick={() => setCartOpen(false)}
                aria-label="Close bag"
              >
                <X size={20} />
              </button>
            </div>

            {cartItems.length > 0 ? (
              <>
                <div className="drawer-free-shipping-bar">
                  <span>✓ You qualify for <strong>FREE Express Pan-India Shipping!</strong></span>
                </div>

                <div className="drawer-items-list">
                  {cartItems.map(item => (
                    <div key={item.id} className="drawer-item-row">
                      <div className="drawer-item-thumb">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="75px"
                          className="thumb-img"
                        />
                      </div>

                      <div className="drawer-item-details">
                        <h4 className="drawer-item-name">{item.title}</h4>
                        <div className="drawer-item-tags">
                          <span>Color: {item.color}</span>
                          <span>·</span>
                          <span>Size: {item.size}</span>
                        </div>
                        <span className="drawer-item-price">{item.price}</span>

                        <div className="drawer-qty-actions">
                          <div className="qty-pill">
                            <button
                              type="button"
                              onClick={() => updateItemQty(item.id, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="qty-number">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateItemQty(item.id, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="remove-btn"
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="drawer-footer-block">
                  <div className="drawer-subtotal-row">
                    <span>Subtotal</span>
                    <b>Rs. {subtotal.toLocaleString('en-IN')}</b>
                  </div>
                  <small className="tax-shipping-note">Taxes included. Free delivery across India.</small>

                  <button
                    type="button"
                    className="drawer-checkout-btn"
                    onClick={() => {
                      alert(`Proceeding to checkout with ${totalQuantity} items (Total: Rs. ${subtotal.toLocaleString('en-IN')})`);
                    }}
                  >
                    <span>SECURE CHECKOUT</span>
                    <ArrowRight size={16} />
                  </button>

                  <div className="drawer-guarantees">
                    <span>🔒 256-bit Encrypted</span>
                    <span>·</span>
                    <span>⚡ 2-4 Days Metro Delivery</span>
                    <span>·</span>
                    <span>↺ 7-Day Size Exchange</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="drawer-empty-state">
                <ShoppingBag size={48} className="empty-bag-icon" />
                <h4>Your Bag is Empty</h4>
                <p>Explore our signature scrubs, acoustic sedescopes, and course-wise carekits.</p>
                <button
                  type="button"
                  className="empty-shop-cta"
                  onClick={() => {
                    setCartOpen(false);
                    document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  SHOP BESTSELLERS
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
