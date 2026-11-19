'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { 
  ArrowUpRight, CheckCircle2, ChevronDown, Droplets, Feather, HeartHandshake, 
  Layers, Mail, Phone, RefreshCw, Send, ShieldCheck, Sparkles, Users, Wind 
} from 'lucide-react';

export default function BalanceSections() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setEmail('');
      setSubscribed(false);
    }, 3500);
  };

  const faqs = [
    {
      q: 'How do I choose the best size for YEVA scrubs?',
      a: 'YEVA scrubs are tailored with a modern athletic silhouette. If you prefer a tailored, clean tuck-in fit, choose your standard T-shirt size. If you like a looser, relaxed fit for heavy layering, we recommend sizing up. A comprehensive chest and inseam sizing chart is available on each product page.'
    },
    {
      q: 'Can our hospital, clinic, or medical college batch order custom embroidered uniforms?',
      a: 'Yes, absolutely! We specialize in custom institutional embroidery with departmental color-coding, institutional crests, and doctor name personalization. Contact our institutional sales team at 9544044266 or email info@yavamed.com for discounted bulk quotation tiers.'
    },
    {
      q: 'What is included inside the YEVA Course-Wise CareKits?',
      a: 'Each CareKit is curated specifically for your healthcare curriculum (MBBS, Nursing, Physiotherapy, or Paramedical). Kits typically feature our certified dual-head acoustic Sedescope, an aneroid BP apparatus with calibration key, digital pulse oximeter, clinical thermometer, pen torch, and surgical shears — all securely organized inside a custom shock-resistant hard case.'
    },
    {
      q: 'How should I wash and care for my YEVA RYX™ scrubs?',
      a: 'YEVA RYX™ fabric is engineered for effortless clinical maintenance. Machine wash cold or warm with similar colors using mild detergent. Tumble dry on low or line dry in the shade. The fabric is inherently wrinkle-resistant, anti-static, and autoclave-safe without requiring iron press.'
    },
    {
      q: 'What are your delivery timelines and return/exchange policies?',
      a: 'We ship pan-India with express courier partners. Metros typically arrive within 2–4 business days; other locations within 4–6 days. We offer hassle-free 7-day size exchanges so your shift uniform fits with 100% confidence.'
    }
  ];

  return (
    <div className="balance-sections-wrap">
      {/* 01: Fabric Innovation Section */}
      <section className="fabric-tech-section" id="fabric-tech">
        <div className="section-container">
          <div className="fabric-header-row">
            <div>
              <div className="kicker-badge-row">
                <span className="section-pill-tag">06 / TEXTILE SCIENCE</span>
                <span className="section-pill-meta">ENGINEERED PERFORMANCE KNIT</span>
              </div>
              <h2 className="fabric-section-title">
                Textiles engineered for <em>the science of movement.</em>
              </h2>
            </div>
            <p className="fabric-section-desc">
              Every healthcare specialty demands different levels of stretch, weight, and barrier protection. YEVA has engineered three distinct fabric collections to match every shift.
            </p>
          </div>

          <div className="fabric-cards-grid">
            {/* Fabric 1 */}
            <article className="fabric-tier-card">
              <div className="tier-badge-row">
                <span className="tier-num">01</span>
                <span className="tier-name">YEVA RYX™</span>
                <span className="tier-tag">PREMIUM SIGNATURE</span>
              </div>
              <h3 className="tier-headline">Cloud-Soft 4-Way Stretch</h3>
              <p className="tier-copy">
                Our pinnacle medical fabric. Combines four-way multi-directional stretch with an ultra-soft handfeel and SILV-SHIELD™ fluid-repellent barrier. Maintains a razor-sharp, wrinkle-free drape from 8 AM ward rounds to midnight call.
              </p>
              <div className="tier-attributes">
                <div className="attr-pill"><Sparkles size={13} /><span>4-Way Stretch</span></div>
                <div className="attr-pill"><Droplets size={13} /><span>Fluid Repellent</span></div>
                <div className="attr-pill"><Wind size={13} /><span>High Breathability</span></div>
                <div className="attr-pill"><RefreshCw size={13} /><span>Anti-Wrinkle</span></div>
              </div>
              <div className="tier-touch-bar">
                <small>TOUCH & FEEL</small>
                <b>Silky, featherlight and frictionless against skin</b>
              </div>
            </article>

            {/* Fabric 2 */}
            <article className="fabric-tier-card">
              <div className="tier-badge-row">
                <span className="tier-num">02</span>
                <span className="tier-name">YEVA LITE™</span>
                <span className="tier-tag">FEATHERLIGHT AIR-FLOW</span>
              </div>
              <h3 className="tier-headline">Lightness You Can Feel</h3>
              <p className="tier-copy">
                Designed for high-temperature wards and high-velocity clinical environments. Built with micro-perforated cool-channel yarns that accelerate sweat evaporation and prevent moisture accumulation.
              </p>
              <div className="tier-attributes">
                <div className="attr-pill"><Feather size={13} /><span>Feather-Light 165 GSM</span></div>
                <div className="attr-pill"><Wind size={13} /><span>Air-Flow Channels</span></div>
                <div className="attr-pill"><RefreshCw size={13} /><span>Fast Moisture Evaporation</span></div>
                <div className="attr-pill"><Layers size={13} /><span>2-Way Flexibility</span></div>
              </div>
              <div className="tier-touch-bar">
                <small>TOUCH & FEEL</small>
                <b>Ultra-breathable, crisp and cooling</b>
              </div>
            </article>

            {/* Fabric 3 */}
            <article className="fabric-tier-card">
              <div className="tier-badge-row">
                <span className="tier-num">03</span>
                <span className="tier-name">YEVA CORE™</span>
                <span className="tier-tag">HOSPITAL RELIABILITY</span>
              </div>
              <h3 className="tier-headline">Heavy-Duty Clinical Performance</h3>
              <p className="tier-copy">
                The dependable workhorse designed for daily hospital laundry sanitization and intensive wear. Reinforced ripstop weave locks in rich colors and resists abrasion against clipboards and equipment belts.
              </p>
              <div className="tier-attributes">
                <div className="attr-pill"><ShieldCheck size={13} /><span>Hospital Laundry Certified</span></div>
                <div className="attr-pill"><Sparkles size={13} /><span>Color-Lock Guarantee</span></div>
                <div className="attr-pill"><Layers size={13} /><span>High Tensile Strength</span></div>
                <div className="attr-pill"><RefreshCw size={13} /><span>Stain Resistant</span></div>
              </div>
              <div className="tier-touch-bar">
                <small>TOUCH & FEEL</small>
                <b>Substantial, durable and structured</b>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* 02: Why Choose YEVA Section */}
      <section className="why-yeva-section" id="why-yeva">
        <div className="section-container">
          <div className="why-header">
            <span className="section-pill-tag">07 — WHY YEVAMED</span>
            <h2 className="why-title">
              More than medical wear.<br /><em>A standard of everyday care.</em>
            </h2>
            <p className="why-subtitle">
              We started YEVA because healthcare professionals in India deserve uniforms and instruments that treat them with the same dignity and precision they bring to their patients.
            </p>
          </div>

          <div className="why-grid-6">
            <div className="why-pillar-card">
              <span className="why-pillar-num">01</span>
              <h3>Bio-Fluid & Microbial Shield</h3>
              <p>Hydrophobic nano-coating ensures liquid, blood, and chemical splashes bead up and slide off without penetrating your skin or clothes.</p>
            </div>

            <div className="why-pillar-card">
              <span className="why-pillar-num">02</span>
              <h3>Ergonomic Utility Architecture</h3>
              <p>Pockets engineered at anatomically verified angles so your surgical shears, phone, stethoscope, and pen-lights stay firmly in place without bouncing.</p>
            </div>

            <div className="why-pillar-card">
              <span className="why-pillar-num">03</span>
              <h3>Course-Specific Certified Tools</h3>
              <p>CareKits verified against clinical syllabi of MCI/NMC, Indian Nursing Council, and IAP, saving students time and money.</p>
            </div>

            <div className="why-pillar-card">
              <span className="why-pillar-num">04</span>
              <h3>Athletic Modern Tailoring</h3>
              <p>Contemporary flattering silhouettes that look professional in hospital corridors and feel as comfortable as luxury athletic wear.</p>
            </div>

            <div className="why-pillar-card">
              <span className="why-pillar-num">05</span>
              <h3>Direct Student-Friendly Value</h3>
              <p>By eliminating medical supply middlemen, we bring clinical-grade materials and certified instruments directly to students at honest pricing.</p>
            </div>

            <div className="why-pillar-card">
              <span className="why-pillar-num">06</span>
              <h3>Hassle-Free 7-Day Exchange</h3>
              <p>Rapid dispatch across India with straightforward size exchanges and dedicated WhatsApp healthcare customer support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 03: Team Orders & Institutional Section */}
      <section className="team-orders-section" id="teams">
        <div className="team-orders-container">
          <div className="team-orders-content">
            <span className="team-pill-tag">08 / INSTITUTIONAL & TEAM WEAR</span>
            <h2 className="team-orders-heading">
              Better together.<br /><em>Uniform by uniform.</em>
            </h2>
            <p className="team-orders-desc">
              Outfit your hospital department, surgical unit, clinic chain, or medical college batch with matching YEVA uniforms and custom-embroidered crests.
            </p>

            <div className="team-benefits-list">
              <div className="benefit-item">
                <CheckCircle2 size={16} className="benefit-icon" />
                <span>Custom Logo & Name Embroidery</span>
              </div>
              <div className="benefit-item">
                <CheckCircle2 size={16} className="benefit-icon" />
                <span>Department Color-Coding Systems</span>
              </div>
              <div className="benefit-item">
                <CheckCircle2 size={16} className="benefit-icon" />
                <span>Student Council & Batch Discounts</span>
              </div>
              <div className="benefit-item">
                <CheckCircle2 size={16} className="benefit-icon" />
                <span>Dedicated Account Manager & Sample Sizing Kits</span>
              </div>
            </div>

            <div className="team-actions-row">
              <a 
                href="mailto:info@yavamed.com?subject=YEVA%20Institutional%20%26%20Team%20Uniform%20Enquiry" 
                className="team-cta-btn"
              >
                <span>REQUEST INSTITUTIONAL QUOTE</span>
                <ArrowUpRight size={16} />
              </a>

              <div className="team-contact-quick">
                <Phone size={15} />
                <a href="tel:+919544044266">+91 95440 44266</a>
                <span>·</span>
                <a href="tel:+919633264851">+91 96332 64851</a>
              </div>
            </div>
          </div>

          <div className="team-orders-visual">
            <div className="team-visual-inner">
              <Image
                src="/images/brochure-p1-2.jpg"
                alt="YEVA healthcare team in scrubs"
                fill
                sizes="(max-width: 800px) 100vw, 45vw"
                className="team-photo"
              />
              <div className="team-visual-caption">
                <b>YEVA MED / THE PEOPLE BEHIND HEALTHCARE</b>
                <span>Serving 450+ Hospitals & Medical Colleges</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 04: FAQ Accordion Section */}
      <section className="faq-section" id="faq">
        <div className="section-container">
          <div className="faq-header">
            <span className="section-pill-tag">09 / FREQUENTLY ASKED QUESTIONS</span>
            <h2 className="faq-title">Everything you need to know.</h2>
            <p className="faq-subtitle">
              Clear answers regarding our fabrics, sizing, carekits, and institutional delivery.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleFaq(index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`faq-arrow ${isOpen ? 'rotated' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="faq-answer-panel">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 05: Newsletter Subscription */}
      <section className="newsletter-section">
        <div className="section-container">
          <div className="newsletter-card">
            <div className="newsletter-info">
              <span className="newsletter-tag">JOIN THE CIRCLE OF HEALTHCARE EXCELLENCE</span>
              <h2 className="newsletter-title">Receive 10% off your first uniform order.</h2>
              <p className="newsletter-desc">
                Be the first to know when new surgical scrub colors drop, restock alerts for CareKits, and medical student discounts.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="newsletter-form">
              <div className="newsletter-input-group">
                <Mail size={17} className="mail-icon" />
                <input
                  type="email"
                  required
                  placeholder="Enter your doctor / student email..."
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  disabled={subscribed}
                />
                <button type="submit" disabled={subscribed}>
                  {subscribed ? 'SUBSCRIBED!' : 'GET 10% OFF'}
                </button>
              </div>
              {subscribed && (
                <p className="newsletter-success">
                  Welcome to the YEVA circle! Check your inbox for your 10% welcome coupon.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* 06: Comprehensive Luxury Footer */}
      <footer className="site-footer" id="contact">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <Image
              src="/images/yeva-wordmark-white.png"
              alt="YEVA"
              width={140}
              height={48}
              className="footer-logo"
            />
            <p className="footer-ethos">
              WE ENGINEER COMFORT.<br />
              WE DESIGN CONFIDENCE.<br />
              Medical wear and healthcare essentials, thoughtfully crafted for the people who care.
            </p>
            <div className="footer-locations">
              <span>Delhi</span>
              <span>·</span>
              <span>Mangalore</span>
              <span>·</span>
              <span>Bangalore</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>SHOP YEVA</h4>
            <ul>
              <li><Link href="#shop-by-color">Shop by Color</Link></li>
              <li><Link href="#bestsellers">Bestsellers</Link></li>
              <li><Link href="#three-pillars">Acoustic Sedescopes</Link></li>
              <li><Link href="#three-pillars">Course CareKits</Link></li>
              <li><Link href="#bestsellers">Men’s Scrubs</Link></li>
              <li><Link href="#bestsellers">Women’s Scrubs</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>INNOVATION & STORY</h4>
            <ul>
              <li><Link href="#fabric-tech">YEVA RYX™ 4-Way Stretch</Link></li>
              <li><Link href="#fabric-tech">YEVA LITE™ Breathable</Link></li>
              <li><Link href="#fabric-tech">YEVA CORE™ Hospital Weave</Link></li>
              <li><Link href="#why-yeva">Why Choose YEVA</Link></li>
              <li><Link href="#reviews">Clinical Reviews (10,615+)</Link></li>
              <li><Link href="#teams">Institutional Team Orders</Link></li>
            </ul>
          </div>

          <div className="footer-contact-col">
            <h4>CONTACT & ASSISTANCE</h4>
            <div className="footer-contact-entries">
              <div>
                <small>DIRECT HELPLINE</small>
                <a href="tel:+919544044266">+91 95440 44266</a>
                <a href="tel:+919633264851">+91 96332 64851</a>
              </div>
              <div>
                <small>EMAIL INQUIRIES</small>
                <a href="mailto:info@yavamed.com">info@yavamed.com</a>
              </div>
              <div>
                <small>COLLEGE AMBASSADORS</small>
                <p>Apply for our campus representative program.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom-row">
          <span>© {new Date().getFullYear()} YEVAMED Healthcare Essentials Pvt Ltd. All rights reserved.</span>
          <div className="footer-legal-links">
            <Link href="#faq">Privacy Policy</Link>
            <Link href="#faq">Terms of Service</Link>
            <Link href="#faq">Shipping & Exchanges</Link>
            <a href="#top">Back to top ↑</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
