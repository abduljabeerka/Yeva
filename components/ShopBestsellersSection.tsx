'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Star, Check, ShoppingBag, Eye, Heart } from 'lucide-react';

export interface BestsellerProduct {
  id: string;
  category: 'Men' | 'Women' | 'Instruments' | 'CareKits';
  title: string;
  rating: number;
  reviewCount: number;
  price: string;
  mrp: string;
  image: string;
  tag: string;
  swatches: { name: string; hex: string }[];
  description: string;
}

const bestsellers: BestsellerProduct[] = [
  {
    id: 'bs-men-eco-navy',
    category: 'Men',
    title: 'Men Eco Tech 5 Pocket Tuck In Midnight Blue Scrubs',
    rating: 4.96,
    reviewCount: 1420,
    price: 'Rs. 2,595',
    mrp: 'Rs. 3,495',
    image: '/images/bestsellers/bestseller-1.jpg',
    tag: 'BESTSELLER',
    description: 'Our top-rated men’s clinical scrub set. Features a modern tuck-in top with reinforced shoulder yokes and 5-pocket jogger trousers.',
    swatches: [
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Midnight Teal', hex: '#1b4858' },
      { name: 'Midnight Blue', hex: '#1d2d54' },
      { name: 'Galaxy Purple', hex: '#3b294e' },
      { name: 'Tuscan Olive', hex: '#414a38' }
    ]
  },
  {
    id: 'bs-women-mandarin-galaxy',
    category: 'Women',
    title: 'Women Mandarin Technical 5 Pocket Galaxy Scrubs',
    rating: 4.80,
    reviewCount: 980,
    price: 'Rs. 2,295',
    mrp: 'Rs. 2,995',
    image: '/images/bestsellers/bestseller-2.jpg',
    tag: 'NEW MANDARIN',
    description: 'Chic Mandarin collar with clean hidden placket. Tailored specifically for female medical practitioners with contour back seams.',
    swatches: [
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Midnight Teal', hex: '#1b4858' },
      { name: 'Midnight Blue', hex: '#1d2d54' },
      { name: 'Galaxy Purple', hex: '#3b294e' }
    ]
  },
  {
    id: 'bs-men-slate-grey',
    category: 'Men',
    title: 'Men Technical 5 Pocket Slate Grey Scrubs',
    rating: 4.90,
    reviewCount: 2100,
    price: 'Rs. 2,095',
    mrp: 'Rs. 2,795',
    image: '/images/bestsellers/bestseller-3.jpg',
    tag: 'CORE FAVORITE',
    description: 'High-durability everyday clinical set in understated slate grey. Anti-static, wrinkle-resistant and tested for hospital laundry wash cycles.',
    swatches: [
      { name: 'Slate Grey', hex: '#4b5058' },
      { name: 'Royal Blue', hex: '#1a4590' },
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Midnight Teal', hex: '#1b4858' },
      { name: 'Burgundy', hex: '#4a1e27' },
      { name: 'Midnight Blue', hex: '#1d2d54' }
    ]
  },
  {
    id: 'bs-women-tuckin-teal',
    category: 'Women',
    title: 'Women Eco Tech 5 Pocket Tuck In Midnight Teal Scrubs',
    rating: 4.90,
    reviewCount: 1840,
    price: 'Rs. 2,595',
    mrp: 'Rs. 3,495',
    tag: 'TOP RATED',
    image: '/images/bestsellers/bestseller-4.jpg',
    description: 'High-visibility oceanic teal designed for surgical wards. Cloud-soft 4-way stretch with fluid-repellent barrier and deep cargo pockets.',
    swatches: [
      { name: 'Pitch Black', hex: '#111111' },
      { name: 'Midnight Teal', hex: '#1b4858' },
      { name: 'Midnight Blue', hex: '#1d2d54' },
      { name: 'Burgundy', hex: '#4a1e27' },
      { name: 'Tuscan Olive', hex: '#414a38' }
    ]
  },
  {
    id: 'bs-sedescope-master',
    category: 'Instruments',
    title: 'YEVA Clinical Acoustic Master Sedescope Stethoscope',
    rating: 4.98,
    reviewCount: 860,
    price: 'Rs. 1,895',
    mrp: 'Rs. 2,495',
    tag: 'DOCTOR’S CHOICE',
    image: '/images/brochure-p1-1.jpg',
    description: 'Precision auscultation stethoscope with solid surgical stainless steel chestpiece and tunable diaphragm for cardiology & respiratory examination.',
    swatches: [
      { name: 'Stainless Silver', hex: '#d0d0d5' },
      { name: 'Stealth Black', hex: '#141416' },
      { name: 'Rose Gold Edition', hex: '#b76e79' }
    ]
  },
  {
    id: 'bs-carekit-complete',
    category: 'CareKits',
    title: 'YEVA Complete Medical & Nursing Student CareKit Bundle',
    rating: 4.95,
    reviewCount: 1150,
    price: 'Rs. 3,495',
    mrp: 'Rs. 4,995',
    tag: 'COLLEGE BUNDLE',
    image: '/images/brochure-p1-1.jpg',
    description: 'All mandatory diagnostic instruments for clinical years — certified Sedescope, BP apparatus, pulse oximeter, reflex hammer & pen torch in a molded organizer box.',
    swatches: [
      { name: 'Classic Navy Case', hex: '#1d2d54' },
      { name: 'Stealth Slate Case', hex: '#24262c' }
    ]
  }
];

interface Props {
  onAddToCart?: (item: { title: string; price: string; color: string; size: string; image: string }) => void;
}

export default function ShopBestsellersSection({ onAddToCart }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Men' | 'Women' | 'Instruments' | 'CareKits'>('All');
  const [activeSwatches, setActiveSwatches] = useState<{ [id: string]: number }>({
    'bs-men-eco-navy': 2,
    'bs-women-mandarin-galaxy': 3,
    'bs-men-slate-grey': 0,
    'bs-women-tuckin-teal': 1,
    'bs-sedescope-master': 0,
    'bs-carekit-complete': 0
  });
  const [addedItem, setAddedItem] = useState<string | null>(null);

  const filtered = bestsellers.filter(p => {
    if (selectedFilter === 'All') return true;
    return p.category === selectedFilter;
  });

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = direction === 'left' ? -380 : 380;
    scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const handleQuickAdd = (product: BestsellerProduct) => {
    const swatchIndex = activeSwatches[product.id] || 0;
    const swatch = product.swatches[swatchIndex] || product.swatches[0];
    
    if (onAddToCart) {
      onAddToCart({
        title: product.title,
        price: product.price,
        color: swatch.name,
        size: 'M',
        image: product.image
      });
    }

    setAddedItem(product.id);
    setTimeout(() => {
      setAddedItem(null);
    }, 1800);
  };

  return (
    <section className="bestsellers-section" id="bestsellers">
      <div className="section-container">
        {/* Header matching user reference screenshot 2 */}
        <div className="bestsellers-header">
          <div className="bestsellers-title-group">
            <div className="kicker-badge-row">
              <span className="section-pill-tag">04 / THE CLINICAL ESSENTIALS</span>
              <span className="section-pill-meta">OVER 25,000+ UNITS TRUSTED</span>
            </div>
            <h2 className="bestsellers-title">Shop Bestsellers</h2>
            <p className="bestsellers-subtitle">
              The uniforms and instruments most trusted by hospitals, medical colleges, and healthcare champions across India.
            </p>
          </div>

          <div className="bestsellers-controls-row">
            {/* Filter Tabs */}
            <div className="bestsellers-tabs">
              {(['All', 'Men', 'Women', 'Instruments', 'CareKits'] as const).map(tab => (
                <button
                  key={tab}
                  type="button"
                  className={`tab-btn ${selectedFilter === tab ? 'active' : ''}`}
                  onClick={() => setSelectedFilter(tab)}
                >
                  {tab === 'Instruments' ? 'Sedescopes' : tab === 'CareKits' ? 'CareKits' : tab}
                </button>
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="bestsellers-nav-arrows">
              <button
                type="button"
                className="bestseller-nav-arrow"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                className="bestseller-nav-arrow"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Product Cards Row */}
        <div className="bestsellers-viewport" ref={scrollRef}>
          <div className="bestsellers-track">
            {filtered.map(product => {
              const activeIndex = activeSwatches[product.id] || 0;
              const activeColorName = product.swatches[activeIndex]?.name;
              const isAdded = addedItem === product.id;

              return (
                <article key={product.id} className="bestseller-card">
                  <div className="bestseller-image-wrap">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 260px, 320px"
                      className="bestseller-product-image"
                    />
                    <span className="bestseller-tag">{product.tag}</span>

                    <button
                      type="button"
                      className="bestseller-quick-add-btn"
                      onClick={() => handleQuickAdd(product)}
                      disabled={isAdded}
                      aria-label={`Quick add ${product.title}`}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} />
                          <span>ADDED TO BAG</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} />
                          <span>QUICK ADD</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Swatches Row matching user screenshot 2 */}
                  <div className="bestseller-swatches-row">
                    <div className="swatches-dots-list">
                      {product.swatches.map((swatch, idx) => (
                        <button
                          key={swatch.name}
                          type="button"
                          className={`bestseller-swatch-box ${activeIndex === idx ? 'active' : ''}`}
                          style={{ backgroundColor: swatch.hex }}
                          title={swatch.name}
                          onClick={() => setActiveSwatches(prev => ({ ...prev, [product.id]: idx }))}
                          aria-label={`Select ${swatch.name}`}
                        />
                      ))}
                    </div>
                    {product.swatches.length > 4 && (
                      <span className="swatches-more-plus">+</span>
                    )}
                  </div>

                  {/* Rating Stars matching user screenshot 2 */}
                  <div className="bestseller-rating-row">
                    <div className="rating-stars-list">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} size={13} className="star-filled" fill="#20204d" stroke="#20204d" />
                      ))}
                    </div>
                    <span className="rating-score-num">{product.rating.toFixed(2)}</span>
                    <span className="rating-reviews-count">({product.reviewCount})</span>
                  </div>

                  {/* Product Title */}
                  <h3 className="bestseller-product-title" title={product.title}>
                    {product.title}
                  </h3>

                  {/* Price Row */}
                  <div className="bestseller-price-row">
                    <span className="bestseller-price-now">{product.price}</span>
                    <span className="bestseller-price-mrp">{product.mrp}</span>
                    <span className="bestseller-discount-badge">25% OFF</span>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
