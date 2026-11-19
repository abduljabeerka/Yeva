'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Eye, Plus, ShoppingBag, X, Sparkles } from 'lucide-react';

export interface ColorProduct {
  id: string;
  name: string;
  tone: string;
  hex: string;
  image: string;
  price: string;
  mrp: string;
  description: string;
  fabric: string;
  pockets: string;
  sizes: string[];
}

const colorProducts: ColorProduct[] = [
  {
    id: 'color-espresso',
    name: 'Espresso',
    tone: 'Deep Earthy Brown',
    hex: '#261a18',
    image: '/images/shop-by-color/espresso.jpg',
    price: 'Rs. 2,595',
    mrp: 'Rs. 3,495',
    description: 'A grounded, calming coffee brown tone engineered with our cloud-soft YEVA RYX™ 4-way stretch fabric. Designed for intensive clinical postings and long hours in motion.',
    fabric: 'YEVA RYX™ 4-Way Stretch (72% Poly, 21% Rayon, 7% Spandex)',
    pockets: '5 Pockets (Deep cargo, scissors sleeve, chest pocket)',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'color-midnight-galaxy',
    name: 'Midnight Galaxy',
    tone: 'Deep Imperial Violet',
    hex: '#3b294e',
    image: '/images/shop-by-color/midnight-galaxy.jpg',
    price: 'Rs. 2,295',
    mrp: 'Rs. 2,995',
    description: 'A distinctive, rich violet-plum hue that brings modern sophistication to medical wards. Features a modern mandarin collar and contoured jogger trousers.',
    fabric: 'YEVA RYX™ Silk-Touch Weave with Anti-Static Finish',
    pockets: '5 Pockets (Includes secure zippered pocket)',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'color-tuscan-olive',
    name: 'Tuscan Olive',
    tone: 'Botanical Sage Olive',
    hex: '#414a38',
    image: '/images/shop-by-color/tuscan-olive.jpg',
    price: 'Rs. 2,595',
    mrp: 'Rs. 3,495',
    description: 'A soothing botanical olive tone with crisp white drawstrings and reinforced knee seams. Repels fluids and stays pristine after dozens of commercial autoclave cycles.',
    fabric: 'YEVA FLEX™ Breathable 4-Way Stretch',
    pockets: '6 Pockets (Ergonomic utility placement)',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'color-royal-navy',
    name: 'Royal Navy',
    tone: 'Classic Medical Marine',
    hex: '#1c2d54',
    image: '/images/shop-by-color/royal-navy.jpg',
    price: 'Rs. 2,095',
    mrp: 'Rs. 2,795',
    description: 'The quintessential hospital standard navy elevated with breathable cool-touch poly-cotton. Generously pocketed to hold stethoscopes, penlights, and patient charts.',
    fabric: 'YEVA CORE™ Hospital-Certified Heavy-Duty Weave',
    pockets: '8 Functional Pockets (Maximum ward utility)',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'color-midnight-teal',
    name: 'Midnight Teal',
    tone: 'Moody Oceanic Teal',
    hex: '#1a4755',
    image: '/images/shop-by-color/midnight-teal.jpg',
    price: 'Rs. 2,595',
    mrp: 'Rs. 3,495',
    description: 'A favored surgeon colorway with high contrast and calming tones. SILV-SHIELD™ anti-microbial treatment provides peace of mind in high-triage environments.',
    fabric: 'YEVA RYX™ Ultra-Light Liquid Barrier Weave',
    pockets: '5 Pockets with dedicated shears pocket',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'color-burgundy-wine',
    name: 'Burgundy Wine',
    tone: 'Deep Crimson Maroon',
    hex: '#4a1e27',
    image: '/images/real-garments/yeva-scrub-burgundy.jpg',
    price: 'Rs. 2,295',
    mrp: 'Rs. 2,995',
    description: 'A deep, regal burgundy hue that flatters every skin tone while effortlessly camouflaging clinic stains. Features a flattering V-neck cut and tapered legs.',
    fabric: 'YEVA RYX™ Soft-Touch Stretch Blend',
    pockets: '5 Pockets with badge loop attachment',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'color-slate-charcoal',
    name: 'Slate Charcoal',
    tone: 'Minimalist Stealth Grey',
    hex: '#3c3e44',
    image: '/images/scrubs-charcoal.png',
    price: 'Rs. 2,095',
    mrp: 'Rs. 2,795',
    description: 'An understated, ultra-sleek graphite charcoal grey for clinicians who prefer a stealth, minimalist clinical presence. Quick-dry and wrinkle-resistant.',
    fabric: 'YEVA LITE™ Breathable 2-Way Mechanical Stretch',
    pockets: '5 Pockets with dual back pockets',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  }
];

interface Props {
  onAddToCart?: (item: { title: string; price: string; color: string; size: string; image: string }) => void;
}

export default function ShopByColorSection({ onAddToCart }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeModal, setActiveModal] = useState<ColorProduct | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [addedNotice, setAddedNotice] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -380 : 380;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleQuickAdd = (product: ColorProduct, size: string) => {
    if (onAddToCart) {
      onAddToCart({
        title: `YEVA Technical Scrub Set — ${product.name}`,
        price: product.price,
        color: product.name,
        size: size,
        image: product.image
      });
    }
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      setActiveModal(null);
    }, 1200);
  };

  return (
    <section className="shop-by-color-section" id="shop-by-color">
      <div className="section-container">
        {/* Header matching user reference screenshot 1 */}
        <div className="color-title-group">
          <div className="kicker-badge-row">
            <span className="section-pill-tag">03 / SIGNATURE SHADES</span>
            <span className="section-pill-meta">FOLDED FLAT-LAY PRESENTATION</span>
          </div>
        </div>
        <div className="color-section-header">
          <div className="color-title-group">
            <h2 className="color-section-title">Shop by Color</h2>
            <p className="color-section-subtitle">
              Folded studio views of our signature medical scrubs on matching solid color fields. Find the tone that defines your everyday practice.
            </p>
          </div>

          <div className="color-nav-controls">
            <button
              type="button"
              className="color-nav-arrow"
              onClick={() => scroll('left')}
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="color-nav-arrow"
              onClick={() => scroll('right')}
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Scrollable horizontal carousel row */}
        <div className="color-cards-viewport" ref={scrollRef}>
          <div className="color-cards-track">
            {colorProducts.map((product) => (
              <article
                key={product.id}
                className="color-card"
                onClick={() => {
                  setSelectedSize('M');
                  setActiveModal(product);
                }}
              >
                <div
                  className="color-card-image-box"
                  style={{ backgroundColor: product.hex }}
                >
                  <Image
                    src={product.image}
                    alt={`${product.name} folded scrub set`}
                    fill
                    sizes="(max-width: 768px) 240px, 300px"
                    className="color-card-image"
                  />
                  <div className="color-card-overlay">
                    <button
                      type="button"
                      className="color-card-quick-view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSize('M');
                        setActiveModal(product);
                      }}
                    >
                      <Eye size={14} />
                      <span>QUICK VIEW</span>
                    </button>
                  </div>
                  <span className="color-card-tag">{product.tone}</span>
                </div>

                <div className="color-card-meta">
                  <div className="color-swatch-dot" style={{ backgroundColor: product.hex }} />
                  <h3 className="color-card-name">{product.name}</h3>
                  <span className="color-card-price">{product.price}</span>
                </div>
                <p className="color-card-caption">4-Way Stretch · Anti-Wrinkle</p>
              </article>
            ))}
          </div>
        </div>
      </div>

      {/* Quick View / Size Selector Modal */}
      {activeModal && (
        <div className="color-modal-backdrop" onClick={() => setActiveModal(null)}>
          <div className="color-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="color-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>

            <div className="color-modal-grid">
              <div
                className="color-modal-image-col"
                style={{ backgroundColor: activeModal.hex }}
              >
                <Image
                  src={activeModal.image}
                  alt={activeModal.name}
                  fill
                  sizes="400px"
                  className="color-modal-image"
                />
              </div>

              <div className="color-modal-info-col">
                <div className="color-modal-swatch-pill">
                  <span
                    className="modal-color-dot"
                    style={{ backgroundColor: activeModal.hex }}
                  />
                  <span>{activeModal.tone}</span>
                </div>

                <h3 className="color-modal-title">{activeModal.name} Scrub Set</h3>
                <div className="color-modal-pricing">
                  <span className="color-modal-price">{activeModal.price}</span>
                  <span className="color-modal-mrp">{activeModal.mrp}</span>
                  <span className="color-modal-save">SAVE 25%</span>
                </div>

                <p className="color-modal-desc">{activeModal.description}</p>

                <div className="color-modal-specs-list">
                  <div>
                    <small>FABRIC</small>
                    <p>{activeModal.fabric}</p>
                  </div>
                  <div>
                    <small>POCKET STORAGE</small>
                    <p>{activeModal.pockets}</p>
                  </div>
                </div>

                <div className="color-modal-size-select">
                  <div className="size-label-row">
                    <span>SELECT SIZE:</span>
                    <small>True to medical fit</small>
                  </div>
                  <div className="size-buttons-row">
                    {activeModal.sizes.map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        className={`size-btn ${selectedSize === sz ? 'selected' : ''}`}
                        onClick={() => setSelectedSize(sz)}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="color-modal-add-btn"
                  disabled={addedNotice}
                  onClick={() => handleQuickAdd(activeModal, selectedSize)}
                >
                  {addedNotice ? (
                    <>
                      <Check size={16} />
                      <span>ADDED TO BAG!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={16} />
                      <span>ADD TO BAG ({selectedSize}) — {activeModal.price}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
