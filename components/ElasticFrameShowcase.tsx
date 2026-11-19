'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, Eye, Plus, ShoppingBag, Sparkles, Sliders, Activity, ShieldCheck, Stethoscope } from 'lucide-react';
import ElasticFrame from './ElasticFrame';

interface Props {
  onAddToCart?: (item: { title: string; price: string; color: string; size: string; image: string }) => void;
}

export default function ElasticFrameShowcase({ onAddToCart }: Props) {
  // Interactive tuning controls for the demo
  const [elasticity, setElasticity] = useState(0.85);
  const [stiffness, setStiffness] = useState(0.12);
  const [damping, setDamping] = useState(0.82);
  const [maxDisplacement, setMaxDisplacement] = useState(30);
  const [activeTheme, setActiveTheme] = useState<'gold' | 'navy' | 'teal'>('gold');

  const themeConfig = {
    gold: {
      borderColor: 'rgba(212, 163, 89, 0.55)',
      glowColor: 'rgba(212, 163, 89, 0.55)',
      veilColor: 'rgba(212, 163, 89, 0.15)',
    },
    navy: {
      borderColor: 'rgba(23, 24, 61, 0.5)',
      glowColor: 'rgba(36, 55, 95, 0.55)',
      veilColor: 'rgba(36, 55, 95, 0.16)',
    },
    teal: {
      borderColor: 'rgba(26, 71, 85, 0.55)',
      glowColor: 'rgba(26, 71, 85, 0.55)',
      veilColor: 'rgba(26, 71, 85, 0.16)',
    },
  }[activeTheme];

  const handleCardAdd = (title: string, price: string, color: string, image: string) => {
    if (onAddToCart) {
      onAddToCart({
        title,
        price,
        color,
        size: 'M',
        image,
      });
    }
  };

  return (
    <section className="elastic-showcase-section" id="elastic-cards">
      <div className="section-container">
        {/* Header */}
        <div className="elastic-showcase-header" style={{ display: 'none' }}>
          <div className="elastic-badge-row">
            <span className="section-pill-tag">INTERACTIVE CARD PHYSICS</span>
            <span className="section-pill-meta">SCROLLTIDE ELASTIC FRAME ENGINE</span>
          </div>

          <h2 className="elastic-showcase-title">
            Cards that react like <em>physical rubber membranes.</em>
          </h2>
          <p className="elastic-showcase-subtitle">
            Move your cursor along the perimeter of each card. The outer border stretches outward dynamically with localized Gaussian displacement, glowing translucent veils, and spring-damper recoil physics.
          </p>

          {/* Interactive Physics Tuner */}
          <div className="physics-tuner-bar">
            <div className="tuner-title-col">
              <Sliders size={16} />
              <span>LIVE PHYSICS CONTROLS</span>
            </div>

            <div className="tuner-slider-group">
              <label>
                <span>Elasticity: {elasticity.toFixed(2)}</span>
                <input
                  type="range"
                  min="0.4"
                  max="1.2"
                  step="0.05"
                  value={elasticity}
                  onChange={(e) => setElasticity(parseFloat(e.target.value))}
                />
              </label>

              <label>
                <span>Max Pull: {maxDisplacement}px</span>
                <input
                  type="range"
                  min="16"
                  max="45"
                  step="1"
                  value={maxDisplacement}
                  onChange={(e) => setMaxDisplacement(parseInt(e.target.value, 10))}
                />
              </label>

              <label>
                <span>Spring Damping: {damping.toFixed(2)}</span>
                <input
                  type="range"
                  min="0.65"
                  max="0.95"
                  step="0.02"
                  value={damping}
                  onChange={(e) => setDamping(parseFloat(e.target.value))}
                />
              </label>
            </div>

            <div className="tuner-color-group">
              <small>Glow Membrane:</small>
              <button
                type="button"
                className={`theme-dot ${activeTheme === 'gold' ? 'active' : ''}`}
                style={{ backgroundColor: '#d4a359' }}
                onClick={() => setActiveTheme('gold')}
                title="Luminous Gold"
              />
              <button
                type="button"
                className={`theme-dot ${activeTheme === 'navy' ? 'active' : ''}`}
                style={{ backgroundColor: '#17183d' }}
                onClick={() => setActiveTheme('navy')}
                title="Clinical Navy"
              />
              <button
                type="button"
                className={`theme-dot ${activeTheme === 'teal' ? 'active' : ''}`}
                style={{ backgroundColor: '#1a4755' }}
                onClick={() => setActiveTheme('teal')}
                title="Oceanic Teal"
              />
            </div>
          </div>
        </div>

        {/* 3 Elastic Frame Demo Cards with Images, Text, Specs, and Buttons */}
        <div className="elastic-cards-grid">
          {/* Card 1: Sedescope */}
          <ElasticFrame
            borderRadius={22}
            borderColor={themeConfig.borderColor}
            glowColor={themeConfig.glowColor}
            veilColor={themeConfig.veilColor}
            elasticity={elasticity}
            stiffness={stiffness}
            damping={damping}
            maxDisplacement={maxDisplacement}
            className="elastic-demo-card-item"
          >
            <div className="elastic-inner-card">
              <div className="elastic-card-image-wrap">
                <Image
                  src="/images/brochure-p1-1.jpg"
                  alt="Acoustic Master Sedescope"
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="elastic-card-photo"
                />
                <span className="elastic-card-badge">Grade 9+ Acoustics</span>
                <div className="elastic-card-tag-pill">DIAGNOSTIC SERIES</div>
              </div>

              <div className="elastic-card-body">
                <div className="card-kicker">STAINLESS STEEL DUAL-HEAD</div>
                <h3 className="card-headline">YEVA Master Sedescope</h3>
                <p className="card-desc">
                  Ultra-sensitive acoustic chestpiece tuned for low-frequency murmurs and high-frequency lung sounds without flipping.
                </p>

                <div className="card-specs-mini">
                  <div>
                    <small>CHESTPIECE</small>
                    <b>Solid Surgical Steel</b>
                  </div>
                  <div>
                    <small>TUBING</small>
                    <b>Skin-Oil Resistant</b>
                  </div>
                </div>

                <div className="card-footer-action">
                  <span className="card-price-tag">Rs. 1,895</span>
                  <button
                    type="button"
                    className="card-action-btn"
                    onClick={() => handleCardAdd('YEVA Master Sedescope', 'Rs. 1,895', 'Stainless Silver', '/images/brochure-p1-1.jpg')}
                  >
                    <Plus size={14} />
                    <span>QUICK ADD</span>
                  </button>
                </div>
              </div>
            </div>
          </ElasticFrame>

          {/* Card 2: Clinical Scrubs */}
          <ElasticFrame
            borderRadius={22}
            borderColor={themeConfig.borderColor}
            glowColor={themeConfig.glowColor}
            veilColor={themeConfig.veilColor}
            elasticity={elasticity}
            stiffness={stiffness}
            damping={damping}
            maxDisplacement={maxDisplacement}
            className="elastic-demo-card-item"
          >
            <div className="elastic-inner-card">
              <div className="elastic-card-image-wrap">
                <Image
                  src="/images/bestsellers/bestseller-1.jpg"
                  alt="Men Eco Tech 5 Pocket Scrubs"
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="elastic-card-photo"
                />
                <span className="elastic-card-badge">4-Way Stretch RYX™</span>
                <div className="elastic-card-tag-pill">BESTSELLER WEAR</div>
              </div>

              <div className="elastic-card-body">
                <div className="card-kicker">ATHLETIC 5-POCKET JOGGER</div>
                <h3 className="card-headline">Eco Tech Tuck In Scrubs</h3>
                <p className="card-desc">
                  Cloud-soft breathable knit infused with liquid-repellent SILV-SHIELD™ barrier and deep storage for medical shears.
                </p>

                <div className="card-specs-mini">
                  <div>
                    <small>FABRIC</small>
                    <b>YEVA RYX™ (190 GSM)</b>
                  </div>
                  <div>
                    <small>BARRIER</small>
                    <b>Fluid-Repellent</b>
                  </div>
                </div>

                <div className="card-footer-action">
                  <span className="card-price-tag">Rs. 2,595</span>
                  <button
                    type="button"
                    className="card-action-btn"
                    onClick={() => handleCardAdd('Eco Tech Tuck In Scrubs', 'Rs. 2,595', 'Midnight Navy', '/images/bestsellers/bestseller-1.jpg')}
                  >
                    <ShoppingBag size={14} />
                    <span>ADD TO BAG</span>
                  </button>
                </div>
              </div>
            </div>
          </ElasticFrame>

          {/* Card 3: CareKit */}
          <ElasticFrame
            borderRadius={22}
            borderColor={themeConfig.borderColor}
            glowColor={themeConfig.glowColor}
            veilColor={themeConfig.veilColor}
            elasticity={elasticity}
            stiffness={stiffness}
            damping={damping}
            maxDisplacement={maxDisplacement}
            className="elastic-demo-card-item"
          >
            <div className="elastic-inner-card">
              <div className="elastic-card-image-wrap">
                <Image
                  src="/images/brochure-p1-1.jpg"
                  alt="Complete Clinical CareKit Bundle"
                  fill
                  sizes="(max-width: 900px) 100vw, 33vw"
                  className="elastic-card-photo"
                />
                <span className="elastic-card-badge">College Approved</span>
                <div className="elastic-card-tag-pill">STUDENT ESSENTIALS</div>
              </div>

              <div className="elastic-card-body">
                <div className="card-kicker">MBBS & NURSING BUNDLE</div>
                <h3 className="card-headline">Course-Wise CareKit</h3>
                <p className="card-desc">
                  Certified Sedescope, aneroid BP apparatus, pulse oximeter, and examination essentials in a molded EVA shock-proof case.
                </p>

                <div className="card-specs-mini">
                  <div>
                    <small>INSTRUMENTS</small>
                    <b>6 Clinical Tools</b>
                  </div>
                  <div>
                    <small>WARRANTY</small>
                    <b>2-Year Guarantee</b>
                  </div>
                </div>

                <div className="card-footer-action">
                  <span className="card-price-tag">Rs. 3,495</span>
                  <button
                    type="button"
                    className="card-action-btn"
                    onClick={() => handleCardAdd('Course-Wise CareKit', 'Rs. 3,495', 'Navy Organizer', '/images/brochure-p1-1.jpg')}
                  >
                    <Plus size={14} />
                    <span>GET BUNDLE</span>
                  </button>
                </div>
              </div>
            </div>
          </ElasticFrame>
        </div>
      </div>
    </section>
  );
}
