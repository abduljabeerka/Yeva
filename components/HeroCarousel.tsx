'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';

export interface HeroSlide {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  secondaryText?: string;
  secondaryHref?: string;
  image: string;
  badge?: string;
}

const initialSlides: HeroSlide[] = [
  {
    id: 'slide-scrubs',
    tag: 'NEW 2026 COLLECTION',
    title: 'WE ENGINEER COMFORT. WE DESIGN CONFIDENCE.',
    subtitle: 'YEVA RYX™ & FLEX Medical Scrubs',
    description: 'Designed for relentless 24-hour shifts. Cloud-soft 4-way stretch, liquid-repellent finish, and functional pocket architecture for healthcare professionals.',
    ctaText: 'SHOP BESTSELLERS',
    ctaHref: '#bestsellers',
    secondaryText: 'EXPLORE FABRIC',
    secondaryHref: '#fabric-tech',
    image: '/images/yeva-shift-essentials-campaign.jpg',
    badge: '10,000+ Shifts Powered'
  },
  {
    id: 'slide-sedescope',
    tag: 'DIAGNOSTIC PRECISION',
    title: 'ACOUSTIC SEDESCOPE CLINICAL SERIES',
    subtitle: 'Ultra-Sensitive Dual-Head Auscultation',
    description: 'Precision-tuned surgical stainless steel chestpiece engineered for cardiology, emergency medicine, and diagnostic accuracy at every heartbeat.',
    ctaText: 'EXPLORE SEDESCOPES',
    ctaHref: '#three-pillars',
    secondaryText: 'VIEW SPECS',
    secondaryHref: '#three-pillars',
    image: '/images/brochure-p1-1.jpg',
    badge: 'Grade 9+ Acoustic Clarity'
  },
  {
    id: 'slide-carekit',
    tag: 'COURSE-WISE MEDICAL KITS',
    title: 'DIFFERENT COURSES. ONE COMPLETE SOLUTION.',
    subtitle: 'MBBS, Nursing & Allied Health Kits',
    description: 'Everything you need from your very first practical posting to clinical internship — certified Sedescope, BP apparatus, and clinical essentials in one organized case.',
    ctaText: 'DISCOVER CAREKITS',
    ctaHref: '#three-pillars',
    secondaryText: 'STUDENT BUNDLES',
    secondaryHref: '#teams',
    image: '/images/brochure-p1-1.jpg',
    badge: 'College Approved'
  },
  {
    id: 'slide-palette',
    tag: 'SIGNATURE SHIFT PALETTE',
    title: 'FIND THE SHADE THAT FEELS LIKE YOU.',
    subtitle: 'Curated Medical Color Study',
    description: 'From deep Espresso and Midnight Galaxy to calm Tuscan Olive and Royal Navy. Tonal scrub sets crafted to elevate your clinical presence.',
    ctaText: 'SHOP BY COLOR',
    ctaHref: '#shop-by-color',
    secondaryText: 'VIEW ALL SHADES',
    secondaryHref: '#shop-by-color',
    image: '/images/brochure-p2-1.jpg',
    badge: '7 Signature Colors'
  },
  {
    id: 'slide-team',
    tag: 'FOR THE WHOLE TEAM',
    title: 'BETTER TOGETHER. UNIFORM BY UNIFORM.',
    subtitle: 'Institutional & Department Orders',
    description: 'Custom hospital logo embroidery, department color-coding, and dedicated volume assistance for clinics, hospitals, and medical student batches.',
    ctaText: 'TEAM ENQUIRIES',
    ctaHref: '#teams',
    secondaryText: 'CONTACT US',
    secondaryHref: '#contact',
    image: '/images/brochure-p1-2.jpg',
    badge: '450+ Hospitals'
  }
];

export default function HeroCarousel() {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animKey, setAnimKey] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleNext = useCallback(() => {
    setSlides(prev => {
      const nextArr = [...prev.slice(1), prev[0]];
      return nextArr;
    });
    setAnimKey(k => k + 1);
  }, []);

  const handlePrev = useCallback(() => {
    setSlides(prev => {
      const prevArr = [prev[prev.length - 1], ...prev.slice(0, prev.length - 1)];
      return prevArr;
    });
    setAnimKey(k => k + 1);
  }, []);

  // Jump to specific slide when clicking thumbnail card
  const handleCardClick = (index: number) => {
    if (index === 0 || index === 1) return;
    setSlides(prev => {
      const count = index - 1;
      const reordered = [...prev.slice(count), ...prev.slice(0, count)];
      return reordered;
    });
    setAnimKey(k => k + 1);
  };

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      handleNext();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying, handleNext]);

  // Touch swipe support
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  // Active slide is index 1 (as in the CodePen pattern where item 1 & 2 are expanded, item 2 displays active content)
  const activeSlide = slides[1] || slides[0];

  return (
    <section 
      className="hero-carousel-section"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Featured Highlights Carousel"
    >
      <div className="hero-carousel-container">
        <div className="hero-carousel-slide">
          {slides.map((item, index) => {
            const isBackdrop = index === 0;
            const isActive = index === 1;
            const isCard3 = index === 2;
            const isCard4 = index === 3;
            const isCard5 = index === 4;
            const isHidden = index >= 5;

            let cardClass = 'hero-card-hidden';
            if (isBackdrop) cardClass = 'hero-card-backdrop';
            else if (isActive) cardClass = 'hero-card-active';
            else if (isCard3) cardClass = 'hero-card-slot-3';
            else if (isCard4) cardClass = 'hero-card-slot-4';
            else if (isCard5) cardClass = 'hero-card-slot-5';

            return (
              <div
                key={item.id}
                className={`hero-carousel-item ${cardClass}`}
                onClick={() => handleCardClick(index)}
                style={{
                  backgroundImage: `url(${item.image})`
                }}
                role={index > 1 ? 'button' : undefined}
                tabIndex={index > 1 ? 0 : undefined}
                aria-label={index > 1 ? `View slide: ${item.subtitle}` : undefined}
              >
                {/* Dark gradient overlay for active slide readability */}
                <div className="hero-item-overlay" />

                {/* Active Slide Content with Staggered Keyframe Animation */}
                {isActive && (
                  <div className="hero-item-content" key={animKey}>
                    {item.tag && (
                      <div className="hero-content-tag">
                        <Sparkles size={13} className="hero-tag-icon" />
                        <span>{item.tag}</span>
                        {item.badge && <span className="hero-tag-badge">{item.badge}</span>}
                      </div>
                    )}
                    
                    <h1 className="hero-content-name">{item.title}</h1>
                    <p className="hero-content-subtitle">{item.subtitle}</p>
                    <p className="hero-content-des">{item.description}</p>
                    
                    <div className="hero-content-actions">
                      <Link href={item.ctaHref} className="hero-cta-button">
                        <span>{item.ctaText}</span>
                        <ArrowRight size={15} />
                      </Link>
                      {item.secondaryText && item.secondaryHref && (
                        <Link href={item.secondaryHref} className="hero-secondary-link">
                          <span>{item.secondaryText}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                {/* Floating Card Title Preview (visible on cards 3, 4, 5) */}
                {index >= 2 && (
                  <div className="hero-card-preview-info">
                    <span className="hero-card-preview-tag">{item.tag}</span>
                    <h4 className="hero-card-preview-title">{item.subtitle}</h4>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Carousel Navigation Buttons (CodePen style < and >) */}
        <div className="hero-carousel-controls">
          <button 
            type="button" 
            className="hero-nav-btn prev" 
            onClick={handlePrev}
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          
          <button 
            type="button" 
            className="hero-nav-btn next" 
            onClick={handleNext}
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>

          <button
            type="button"
            className="hero-play-toggle"
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? 'Pause auto-slide' : 'Play auto-slide'}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={13} /> : <Play size={13} />}
          </button>
        </div>

        {/* Slide Counter & Dots */}
        <div className="hero-carousel-indicators">
          <span className="hero-slide-counter">
            0{initialSlides.findIndex(s => s.id === activeSlide.id) + 1} / 0{initialSlides.length}
          </span>
          <div className="hero-dots-row">
            {initialSlides.map((s, i) => (
              <span
                key={s.id}
                className={`hero-dot ${s.id === activeSlide.id ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
