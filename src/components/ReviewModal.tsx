/**
 * UTSAVO - Post-Event Verified Review Modal
 * Section 15: Multi-dimensional rating (Ambience, Catering, Service, Cleanliness, Price Transparency)
 */

import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMarketplace } from '../context/MarketplaceContext';
import { X, Star, ShieldCheck, Check } from 'lucide-react';

interface ReviewModalProps {
  bookingId: string | null;
  venueId: string | null;
  onClose: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({ bookingId, venueId, onClose }) => {
  const { language } = useLanguage();
  const { bookings, venues, currentUser, addVerifiedReview } = useMarketplace();

  if (!bookingId || !venueId) return null;

  const booking = bookings.find((b) => b.id === bookingId);
  const venue = venues.find((v) => v.id === venueId);

  const [overallRating, setOverallRating] = useState(5);
  const [ambience, setAmbience] = useState(5);
  const [catering, setCatering] = useState(5);
  const [service, setService] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [pricingTransparency, setPricingTransparency] = useState(5);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) return;

    addVerifiedReview({
      venueId,
      bookingRef: booking?.bookingRef || 'UTS-VERIFIED',
      customerName: currentUser.name,
      eventType: booking?.eventType || 'WEDDING',
      eventDateBS: booking?.eventDateBS || '2081 BS',
      overallRating,
      ratings: {
        ambience,
        catering,
        serviceStaff: service,
        cleanliness,
        priceTransparency: pricingTransparency,
      },
      comment,
      verifiedBooking: true,
    });

    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Customer Review · Ref #{booking?.bookingRef}</span>
            </div>
            <h3 className="font-display text-xl font-bold">
              Rate Your Experience at {venue?.name}
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Only hosts with completed events can write verified reviews.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-stone-900">
                Thank you for your verified feedback!
              </h4>
              <p className="text-xs text-stone-500">
                Your review has been verified and published to help future celebration hosts across Nepal.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Overall Star Picker */}
              <div className="p-3 bg-amber-50/70 rounded-2xl border border-amber-200/50 flex items-center justify-between">
                <span className="font-bold text-stone-800">Overall Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setOverallRating(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= overallRating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sub-Criteria Ratings */}
              <div className="space-y-2.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex justify-between items-center">
                  <span>Venue Ambience & Decor:</span>
                  <select
                    value={ambience}
                    onChange={(e) => setAmbience(Number(e.target.value))}
                    className="p-1 bg-white border border-stone-200 rounded font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span>Catering & Food Quality:</span>
                  <select
                    value={catering}
                    onChange={(e) => setCatering(Number(e.target.value))}
                    className="p-1 bg-white border border-stone-200 rounded font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span>Service Staff & Hospitality:</span>
                  <select
                    value={service}
                    onChange={(e) => setService(Number(e.target.value))}
                    className="p-1 bg-white border border-stone-200 rounded font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span>Cleanliness & Restroom Hygiene:</span>
                  <select
                    value={cleanliness}
                    onChange={(e) => setCleanliness(Number(e.target.value))}
                    className="p-1 bg-white border border-stone-200 rounded font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between items-center">
                  <span>Pricing Transparency (No Hidden Fees):</span>
                  <select
                    value={pricingTransparency}
                    onChange={(e) => setPricingTransparency(Number(e.target.value))}
                    className="p-1 bg-white border border-stone-200 rounded font-bold"
                  >
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>{n} Stars</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Share Your Celebration Experience
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail how the banquet team performed, taste of the dishes, and overall experience..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-amber-900 hover:bg-amber-950 rounded-xl shadow transition-colors"
              >
                Publish Verified Review
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
