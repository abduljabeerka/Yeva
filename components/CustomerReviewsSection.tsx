'use client';

import { useState } from 'react';
import { Star, CheckCircle, ThumbsUp, MessageSquare, Filter, ShieldCheck, PenTool, X, Check } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  role: string;
  institution: string;
  rating: number;
  date: string;
  verified: boolean;
  category: 'Surgeons' | 'Nursing' | 'Students' | 'All';
  productPurchased: string;
  headline: string;
  comment: string;
  helpfulCount: number;
}

const reviewsData: Review[] = [
  {
    id: 'rev-1',
    author: 'Dr. Ananya Sharma',
    role: 'Senior Resident, General Surgery',
    institution: 'AIIMS, New Delhi',
    rating: 5,
    date: '2 days ago',
    verified: true,
    category: 'Surgeons',
    productPurchased: 'Men/Women Eco Tech 5 Pocket · Midnight Teal',
    headline: 'Flawless 4-way stretch during 14-hour trauma postings.',
    comment: 'I’ve worn every major Indian and international scrub brand over 7 years of residency. YEVA’s 4-way stretch fabric is leagues ahead. Zero pulling across the shoulders when operating, and it genuinely stays crisp without wrinkling. The shears pocket placement is pure genius.',
    helpfulCount: 84
  },
  {
    id: 'rev-2',
    author: 'Rahul Menon',
    role: 'Critical Care ICU In-Charge',
    institution: 'Manipal Hospital, Bangalore',
    rating: 5,
    date: '1 week ago',
    verified: true,
    category: 'Nursing',
    productPurchased: 'Men Technical 5 Pocket · Royal Navy',
    headline: 'The liquid-repellent shield saved me during emergency code blues.',
    comment: 'In the ICU, spills and body fluid exposure happen in split seconds. With YEVA, liquid literally beads up and rolls off without soaking into the weave. The waistband is wide and doesn’t roll down or cause chaffing during 12-hour night rotations.',
    helpfulCount: 62
  },
  {
    id: 'rev-3',
    author: 'Dr. Farhan Qureshi',
    role: 'Pediatric Cardiology Fellow',
    institution: 'KEM Hospital, Mumbai',
    rating: 5,
    date: '2 weeks ago',
    verified: true,
    category: 'Surgeons',
    productPurchased: 'YEVA Clinical Acoustic Master Sedescope',
    headline: 'Acoustic sensitivity rivals stethoscopes costing triple the price.',
    comment: 'Detecting subtle Grade I/VI systolic murmurs in small pediatric chests requires uncompromising acoustic fidelity. The dual-frequency diaphragm on the YEVA Sedescope delivers crisp, isolated acoustics. Our entire department has started recommending it.',
    helpfulCount: 119
  },
  {
    id: 'rev-4',
    author: 'Sneha Kulkarni',
    role: 'Final Year MBBS Student',
    institution: 'KMC, Mangalore',
    rating: 5,
    date: '3 weeks ago',
    verified: true,
    category: 'Students',
    productPurchased: 'Complete Medical Student CareKit Bundle',
    headline: 'Our whole batch ordered the CareKits. Best decision ever.',
    comment: 'Running to five different surgical shops trying to piece together a BP monitor, sedescope, and diagnostic kit was a nightmare for previous batches. YEVA’s CareKit came beautifully packed in a durable shock-proof case with college-approved instruments. Incredible student pricing!',
    helpfulCount: 95
  },
  {
    id: 'rev-5',
    author: 'Dr. Vikramaditya Roy',
    role: 'Surgical Registrar',
    institution: 'Apollo Multispeciality, Kolkata',
    rating: 5,
    date: '1 month ago',
    verified: true,
    category: 'Surgeons',
    productPurchased: 'Men Eco Tech 5 Pocket · Tuscan Olive',
    headline: 'Athletic tailored fit that breathes in high tropical humidity.',
    comment: 'Most scrubs feel like stiff paper or sag like pajamas. YEVA has nailed the modern athletic cut — sharp silhouette, deep reinforced cargo pockets, and exceptionally breathable knit that keeps you cool even under halogen theater lamps.',
    helpfulCount: 47
  },
  {
    id: 'rev-6',
    author: 'Dr. Fatima Khan',
    role: 'Emergency Medicine Consultant',
    institution: 'Fortis Healthcare, Delhi NCR',
    rating: 5,
    date: '1 month ago',
    verified: true,
    category: 'Surgeons',
    productPurchased: 'Women Mandarin Technical · Midnight Galaxy',
    headline: 'The Mandarin collar is unbelievably chic and professional.',
    comment: 'I get daily compliments from patients and colleagues alike. The Midnight Galaxy color is rich, understated, and doesn’t fade even after 30+ hospital autoclave washes. Deep phone pocket fits my iPhone Pro Max securely.',
    helpfulCount: 73
  }
];

export default function CustomerReviewsSection() {
  const [filter, setFilter] = useState<'All' | 'Surgeons' | 'Nursing' | 'Students'>('All');
  const [helpfulMap, setHelpfulMap] = useState<{ [id: string]: boolean }>({});
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formRating, setFormRating] = useState(5);
  const [formHeadline, setFormHeadline] = useState('');
  const [formComment, setFormComment] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  const filteredReviews = reviewsData.filter(r => {
    if (filter === 'All') return true;
    return r.category === filter;
  });

  const toggleHelpful = (id: string) => {
    setHelpfulMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formComment) return;
    setSubmittedNotice(true);
    setTimeout(() => {
      setSubmittedNotice(false);
      setWriteModalOpen(false);
      setFormName('');
      setFormRole('');
      setFormHeadline('');
      setFormComment('');
    }, 1600);
  };

  return (
    <section className="reviews-section" id="reviews">
      <div className="section-container">
        {/* Header & Overall Ratings */}
        <div className="reviews-header-block">
          <div className="reviews-kicker-row">
            <span className="section-pill-tag">05 / VERIFIED CLINICAL FEEDBACK</span>
            <span className="section-pill-meta">10,615+ REVIEWS ACROSS INDIA</span>
          </div>

          <div className="reviews-summary-grid">
            <div className="summary-score-col">
              <div className="score-number-row">
                <span className="score-big">4.9</span>
                <span className="score-total">/ 5.0</span>
              </div>
              <div className="score-stars-row">
                {[1, 2, 3, 4, 5].map(s => (
                  <Star key={s} size={20} className="summary-star-filled" fill="#20204d" stroke="#20204d" />
                ))}
              </div>
              <p className="score-caption">
                Based on <strong>10,615 verified healthcare reviews</strong>
              </p>
            </div>

            <div className="summary-bars-col">
              <div className="rating-bar-row">
                <span>5 Star</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: '92%' }} /></div>
                <span className="bar-percent">92%</span>
              </div>
              <div className="rating-bar-row">
                <span>4 Star</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: '7%' }} /></div>
                <span className="bar-percent">7%</span>
              </div>
              <div className="rating-bar-row">
                <span>3 Star</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: '1%' }} /></div>
                <span className="bar-percent">1%</span>
              </div>
              <div className="rating-bar-row">
                <span>2 Star</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: '0%' }} /></div>
                <span className="bar-percent">&lt;1%</span>
              </div>
            </div>

            <div className="summary-trust-col">
              <div className="trust-metric-item">
                <ShieldCheck size={20} className="trust-icon" />
                <div>
                  <b>100% Verified Clinicians</b>
                  <p>Doctors, surgeons & nurses verified via hospital ID or university register.</p>
                </div>
              </div>
              <div className="trust-metric-item">
                <CheckCircle size={20} className="trust-icon" />
                <div>
                  <b>Tested on 36-Hr Shifts</b>
                  <p>Certified for continuous comfort, fluid repulsion, and autoclaving.</p>
                </div>
              </div>
              <button
                type="button"
                className="write-review-cta-btn"
                onClick={() => setWriteModalOpen(true)}
              >
                <PenTool size={15} />
                <span>WRITE A REVIEW</span>
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills Bar */}
        <div className="reviews-filter-bar">
          <div className="filter-pills-row">
            <span className="filter-label">Filter by role:</span>
            {(['All', 'Surgeons', 'Nursing', 'Students'] as const).map(f => (
              <button
                key={f}
                type="button"
                className={`filter-pill-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'All' ? 'All Reviews (10,615)' : f === 'Surgeons' ? 'Surgeons & Residents' : f === 'Nursing' ? 'ICU & Nurses' : 'MBBS Students'}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid">
          {filteredReviews.map(review => {
            const isHelpful = helpfulMap[review.id];
            const currentHelpful = review.helpfulCount + (isHelpful ? 1 : 0);

            return (
              <article key={review.id} className="review-card">
                <div className="review-card-head">
                  <div className="review-author-info">
                    <div className="author-avatar-circle">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <h4 className="review-author-name">{review.author}</h4>
                      <p className="review-author-role">{review.role} · <strong>{review.institution}</strong></p>
                    </div>
                  </div>

                  {review.verified && (
                    <span className="verified-badge">
                      <Check size={11} />
                      <span>VERIFIED HERO</span>
                    </span>
                  )}
                </div>

                <div className="review-stars-row">
                  <div className="stars-group">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={14} className="star-filled" fill="#20204d" stroke="#20204d" />
                    ))}
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>

                <div className="review-product-tag">
                  <small>VERIFIED ITEM:</small>
                  <span>{review.productPurchased}</span>
                </div>

                <h3 className="review-headline">“{review.headline}”</h3>
                <p className="review-comment-body">{review.comment}</p>

                <div className="review-card-footer">
                  <button
                    type="button"
                    className={`helpful-btn ${isHelpful ? 'voted' : ''}`}
                    onClick={() => toggleHelpful(review.id)}
                    aria-label="Mark review as helpful"
                  >
                    <ThumbsUp size={13} />
                    <span>Helpful ({currentHelpful})</span>
                  </button>
                  <span className="review-shift-badge">Clinical Tested</span>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Write a Review Modal */}
      {writeModalOpen && (
        <div className="review-modal-backdrop" onClick={() => setWriteModalOpen(false)}>
          <div className="review-modal-box" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="review-modal-close"
              onClick={() => setWriteModalOpen(false)}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            <h3 className="modal-form-title">Share Your Shift Experience</h3>
            <p className="modal-form-desc">
              Your honest feedback helps fellow doctors, nurses, and medical students choose the best gear for their clinical rounds.
            </p>

            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>YOUR RATING</label>
                <div className="rating-select-stars">
                  {[1, 2, 3, 4, 5].map(s => (
                    <button
                      key={s}
                      type="button"
                      className="star-pick-btn"
                      onClick={() => setFormRating(s)}
                    >
                      <Star
                        size={24}
                        fill={s <= formRating ? '#20204d' : 'transparent'}
                        stroke="#20204d"
                      />
                    </button>
                  ))}
                  <span className="rating-pick-label">{formRating} out of 5 Stars</span>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>YOUR NAME / TITLE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Aryan Varma"
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>HOSPITAL / COLLEGE</label>
                  <input
                    type="text"
                    placeholder="e.g. Apollo Hospitals / AIIMS"
                    value={formRole}
                    onChange={e => setFormRole(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>REVIEW HEADLINE</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Incredible comfort during 24-hr emergency duty"
                  value={formHeadline}
                  onChange={e => setFormHeadline(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>YOUR DETAILED REVIEW</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about the fabric feel, pocket utility, breathability, or sizing fit..."
                  value={formComment}
                  onChange={e => setFormComment(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="submit-review-btn"
                disabled={submittedNotice}
              >
                {submittedNotice ? (
                  <>
                    <Check size={16} />
                    <span>THANK YOU! REVIEW SUBMITTED</span>
                  </>
                ) : (
                  <span>SUBMIT VERIFIED REVIEW</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
