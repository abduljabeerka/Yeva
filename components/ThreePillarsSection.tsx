'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { Activity, ArrowUpRight, CheckCircle2, ShieldCheck, Stethoscope, Sparkles, Box } from 'lucide-react';
import ElasticFrame from './ElasticFrame';

interface PillarCard {
  number: string;
  category: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  badge: string;
  features: string[];
  specs: { label: string; value: string }[];
  ctaText: string;
  ctaHref: string;
}

const pillars: PillarCard[] = [
  {
    number: '01',
    category: 'DIAGNOSTIC INSTRUMENTS',
    title: 'Acoustic Sedescope',
    subtitle: 'Precision Auscultation for Critical Decisions',
    description: 'Engineered for cardiology, pulmonology, emergency triage, and clinical learning. Tunable dual-frequency diaphragm allows seamless listening to both low and high frequency sounds without rotating the chestpiece.',
    image: '/images/brochure-p1-1.jpg',
    badge: 'Clinical Grade 9+',
    features: [
      'Precision-machined surgical stainless steel chestpiece',
      'Tunable dual-frequency diaphragm (adult & pediatric)',
      'Next-gen latex-free tubing resistant to skin oils & alcohol',
      'Anatomically angled binaurals with soft silicone sealing eartips'
    ],
    specs: [
      { label: 'Acoustic Rating', value: 'Grade 9+' },
      { label: 'Chestpiece', value: 'Solid Stainless' },
      { label: 'Binaural Angle', value: '15° Anatomical' }
    ],
    ctaText: 'EXPLORE SEDESCOPES',
    ctaHref: '#bestsellers'
  },
  {
    number: '02',
    category: 'PERFORMANCE APPAREL',
    title: 'Clinical Scrubs',
    subtitle: '4-Way Stretch Engineered for 24-Hour Shifts',
    description: 'Crafted with our proprietary YEVA RYX™ and FLEX fabrics. Features a modern athletic silhouette, liquid-repellent technology, and smart pocket architecture to keep every instrument within quick reach.',
    image: '/images/real-garments/yeva-scrub-navy.jpg',
    badge: '4-Way Stretch RYX™',
    features: [
      'Cloud-soft, lightweight 4-way stretch performance weave',
      'SILV-SHIELD™ liquid-repellent & anti-microbial barrier',
      '5 to 8 functional ergonomic pockets for shears, phone & pen-lights',
      'Wrinkle-resistant, quick-dry finish that withstands autoclave washes'
    ],
    specs: [
      { label: 'Fabric Weave', value: 'YEVA RYX™ 4-Way' },
      { label: 'Protection', value: 'Fluid Repellent' },
      { label: 'Pocket Count', value: '5 - 8 Ergonomic' }
    ],
    ctaText: 'SHOP SCRUBS COLLECTION',
    ctaHref: '#shop-by-color'
  },
  {
    number: '03',
    category: 'STUDENT & CLINICAL KITS',
    title: 'Course-Wise CareKits',
    subtitle: 'Curriculum Essentials in One Complete Solution',
    description: 'Carefully curated medical kits designed for medical, nursing, physiotherapy, and paramedical students. Get every certified instrument required for your first practical class to final internship in one organized case.',
    image: '/images/brochure-p1-1.jpg',
    badge: 'College Approved',
    features: [
      'Tailored toolkits for MBBS, Nursing, Physiotherapy & Allied Sciences',
      'Includes Sedescope, aneroid BP apparatus, pulse oximeter & pen torch',
      'Impact-resistant custom branded organizer case with molded inserts',
      'Faculty-approved diagnostic tools designed for clinical postings'
    ],
    specs: [
      { label: 'Curated Kits', value: '6 Courses' },
      { label: 'Certification', value: 'CE / ISO Approved' },
      { label: 'Packaging', value: 'Molded EVA Case' }
    ],
    ctaText: 'DISCOVER CAREKITS',
    ctaHref: '#teams'
  }
];

export default function ThreePillarsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  const handleMobileScroll = () => {
    if (!scrollRef.current) return;
    const scrollLeft = scrollRef.current.scrollLeft;
    const cardWidth = scrollRef.current.offsetWidth * 0.78;
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveMobileIdx(Math.min(Math.max(0, idx), pillars.length - 1));
  };

  return (
    <section className="pillars-section" id="three-pillars">
      <div className="section-container">
        <div className="pillars-header">
          <div className="pillars-kicker-row">
            <span className="section-pill-tag">02 / THE YEVA CLINICAL PILLARS</span>
            <span className="section-pill-meta">ENGINEERED FOR HEALTHCARE HEROES</span>
          </div>
          <h2 className="pillars-main-title">
            Built for the demands of <em>modern healthcare.</em>
          </h2>
          <p className="pillars-sub-title">
            Three foundational categories developed in close collaboration with surgeons, resident doctors, nursing staff, and medical university faculties.
          </p>
        </div>

        <div className="pillars-grid" ref={scrollRef} onScroll={handleMobileScroll}>
          {pillars.map((pillar) => (
            <ElasticFrame
              key={pillar.number}
              borderRadius={20}
              borderColor="rgba(23, 24, 61, 0.4)"
              glowColor="rgba(212, 163, 89, 0.5)"
              veilColor="rgba(212, 163, 89, 0.12)"
              maxDisplacement={28}
              pointerRadius={95}
              className="pillar-elastic-wrapper"
            >
              <article className="pillar-card">
                <div className="pillar-image-container">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 33vw"
                    className="pillar-image"
                  />
                  <div className="pillar-image-overlay" />
                  <span className="pillar-badge">{pillar.badge}</span>
                  <span className="pillar-number">{pillar.number}</span>
                </div>

                <div className="pillar-body">
                  <span className="pillar-category">{pillar.category}</span>
                  <h3 className="pillar-title">{pillar.title}</h3>
                  <h4 className="pillar-subtitle">{pillar.subtitle}</h4>
                  <p className="pillar-description">{pillar.description}</p>

                  <div className="pillar-features">
                    <span className="features-headline">KEY ATTRIBUTES</span>
                    <ul>
                      {pillar.features.map((feat, i) => (
                        <li key={i}>
                          <CheckCircle2 size={14} className="feature-check-icon" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pillar-specs-row">
                    {pillar.specs.map((sp, i) => (
                      <div key={i} className="pillar-spec-item">
                        <small>{sp.label}</small>
                        <b>{sp.value}</b>
                      </div>
                    ))}
                  </div>

                  <Link href={pillar.ctaHref} className="pillar-cta-button">
                    <span>{pillar.ctaText}</span>
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              </article>
            </ElasticFrame>
          ))}
        </div>

        {/* Mobile Swipe Indicators (Visible only on mobile) */}
        <div className="pillars-mobile-dots" aria-hidden="true">
          {pillars.map((_, i) => (
            <span
              key={i}
              className={`pillar-dot ${activeMobileIdx === i ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
