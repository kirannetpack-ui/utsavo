/**
 * UTSAVO - Real Celebration Social Wall
 * Aggregates user-uploaded event photos and testimonials from past bookings
 * to showcase authentic venue experiences (Weddings, Bratabandha, Pasni, Newari Bhoj, Corporate Galas).
 */

import React, { useState, useMemo } from 'react';
import {
  Heart,
  MessageSquare,
  Sparkles,
  Camera,
  Star,
  ShieldCheck,
  Calendar,
  Users,
  MapPin,
  Utensils,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Share2,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { SocialCelebrationPost, EventType, SocialCelebrationPhoto } from '../types';
import { NepalDistrictSelector } from './NepalLocationSelector';

interface SocialCelebrationWallProps {
  onSelectVenue?: (venueId: string) => void;
}

export const SocialCelebrationWall: React.FC<SocialCelebrationWallProps> = ({ onSelectVenue }) => {
  const { socialPosts, likeSocialPost, addSocialPost, venues, setQuickPeekVenueId } = useMarketplace();

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedPostForModal, setSelectedPostForModal] = useState<SocialCelebrationPost | null>(null);
  const [activeLightboxPhotoIndex, setActiveLightboxPhotoIndex] = useState<number>(0);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Form State for Sharing a Celebration Story
  const [formData, setFormData] = useState({
    venueId: venues[0]?.id || '',
    venueName: venues[0]?.name || '',
    venueDistrict: venues[0]?.district || 'Kathmandu',
    eventType: 'WEDDING' as EventType,
    celebrationTitle: '',
    hostName: '',
    hostRole: 'Groom & Bride',
    reviewQuote: '',
    detailedStory: '',
    overallRating: 5,
    eventDateBS: '2081 Mangsir 20',
    guestCount: 450,
    coverPhoto: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    photoUrlInput: '',
    photoTagInput: 'STAGE_MANDAP' as const,
    photos: [] as SocialCelebrationPhoto[],
    cateringHighlightInput: '',
    cateringHighlights: ['Live Jalebi Counter', 'Mutton Kachi Biryani', 'Traditional Samay Baji'],
  });

  const categories = [
    { id: 'ALL', label: 'All Celebrations', labelNp: 'सबै उत्सवहरू' },
    { id: 'WEDDING', label: 'Weddings (विवाह)', labelNp: 'विवाह / लगन' },
    { id: 'BRATABANDHA', label: 'Bratabandha', labelNp: 'उपनयन / व्रतबन्ध' },
    { id: 'PASNI', label: 'Pasni (पास्नी)', labelNp: 'अन्नप्राशन' },
    { id: 'RECEPTION', label: 'Receptions', labelNp: 'प्रीतिभोज' },
    { id: 'CORPORATE_GALA', label: 'Corporate & Galas', labelNp: 'व्यावसायिक सम्मेलन' },
  ];

  const filteredPosts = useMemo(() => {
    if (activeCategory === 'ALL') return socialPosts;
    return socialPosts.filter((post) => post.eventType === activeCategory);
  }, [socialPosts, activeCategory]);

  const handleShare = (post: SocialCelebrationPost, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.celebrationTitle,
        text: `Check out ${post.hostName}'s celebration at ${post.venueName} on UTSAVO Nepal!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedPostId(post.id);
      setTimeout(() => setCopiedPostId(null), 2500);
    }
  };

  const handleOpenVenue = (venueId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (onSelectVenue) {
      onSelectVenue(venueId);
    } else {
      setQuickPeekVenueId(venueId);
    }
  };

  const handleAddPhotoToStory = () => {
    if (!formData.photoUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      photos: [
        ...prev.photos,
        {
          url: prev.photoUrlInput.trim(),
          caption: `${prev.eventType} ceremony moment`,
          tag: prev.photoTagInput,
        },
      ],
      photoUrlInput: '',
    }));
  };

  const handleAddCateringHighlight = () => {
    if (!formData.cateringHighlightInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      cateringHighlights: [...prev.cateringHighlights, prev.cateringHighlightInput.trim()],
      cateringHighlightInput: '',
    }));
  };

  const handleSubmitStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.celebrationTitle.trim() || !formData.reviewQuote.trim() || !formData.hostName.trim()) {
      return;
    }

    const matchedVenue = venues.find((v) => v.id === formData.venueId);

    const postPhotos = formData.photos.length > 0 
      ? formData.photos 
      : [{ url: formData.coverPhoto, caption: formData.celebrationTitle, tag: 'STAGE_MANDAP' as const }];

    addSocialPost({
      venueId: formData.venueId || 'venue-regal-pavilion-ktm',
      venueName: matchedVenue?.name || formData.venueName || 'Verified Celebration Banquet',
      venueDistrict: matchedVenue?.district || formData.venueDistrict || 'Kathmandu',
      venueLocality: matchedVenue?.locality || 'Kathmandu Valley',
      eventType: formData.eventType,
      celebrationTitle: formData.celebrationTitle,
      hostName: formData.hostName,
      hostRole: formData.hostRole,
      reviewQuote: formData.reviewQuote,
      detailedStory: formData.detailedStory || formData.reviewQuote,
      overallRating: formData.overallRating,
      eventDateBS: formData.eventDateBS,
      eventDateAD: new Date().toISOString().split('T')[0],
      guestCount: Number(formData.guestCount) || 350,
      photos: postPhotos,
      coverPhoto: postPhotos[0]?.url || formData.coverPhoto,
      verifiedBooking: true,
      cateringHighlights: formData.cateringHighlights,
      tags: [`#${formData.eventType}`, `#${matchedVenue?.district || 'Nepal'}Celebrations`, '#UTSAVOVerified'],
    });

    setIsUploadModalOpen(false);
    // Reset form
    setFormData((prev) => ({
      ...prev,
      celebrationTitle: '',
      hostName: '',
      reviewQuote: '',
      detailedStory: '',
      photos: [],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Sub-Bar */}
      <div className="bg-gradient-to-r from-red-900 via-rose-900 to-amber-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-400/40 rounded-full text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>Real Venue Moments • वास्तविक उत्सव अनुभव पर्खाल</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
              Celebration Social Wall
            </h2>
            <p className="text-rose-100/90 text-sm sm:text-base mt-1 max-w-2xl">
              Authentic photo albums, guest memories, and unfiltered testimonials from verified Nepali weddings, sacred Bratabandha, Pasni, and galas hosted across Nepal.
            </p>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-neutral-900 font-semibold px-5 py-3 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Share Your Celebration</span>
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeCategory === cat.id
                  ? 'bg-white text-rose-950 font-bold shadow-md'
                  : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Authentic Celebration Stories */}
      {filteredPosts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
          <Camera className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-neutral-800">No Celebration Stories Found</h3>
          <p className="text-sm text-neutral-500 max-w-md mx-auto mt-1">
            Be the first to share an authentic photo album and review from your celebration!
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white font-medium px-4 py-2 rounded-xl text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Story</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-200/80 hover:border-amber-400/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer"
              onClick={() => {
                setSelectedPostForModal(post);
                setActiveLightboxPhotoIndex(0);
              }}
            >
              {/* Cover Photo & Badges */}
              <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                <img
                  src={post.coverPhoto || post.photos[0]?.url}
                  alt={post.celebrationTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                  <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-white text-[11px] font-semibold flex items-center gap-1 border border-white/20">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    <span>{post.eventType.replace('_', ' ')}</span>
                  </span>
                  {post.verifiedBooking && (
                    <span className="px-2.5 py-1 bg-emerald-600/90 backdrop-blur-md rounded-full text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3 text-emerald-200" />
                      <span>Verified Booking</span>
                    </span>
                  )}
                </div>

                {/* Multi-Photo Count Indicator */}
                {post.photos.length > 1 && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[11px] font-medium flex items-center gap-1 border border-white/20">
                    <Camera className="w-3 h-3 text-white/90" />
                    <span>+{post.photos.length} photos</span>
                  </div>
                )}

                {/* Bottom Overlay: Venue Name & Headcount */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center justify-between text-xs text-rose-200 font-medium mb-0.5">
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{post.venueName}</span>
                    </span>
                    <span className="shrink-0 flex items-center gap-1 text-white/90">
                      <Users className="w-3 h-3 text-amber-400" />
                      <span>{post.guestCount} pax</span>
                    </span>
                  </div>
                  <h3 className="font-serif font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-amber-200 transition-colors">
                    {post.celebrationTitle}
                  </h3>
                </div>
              </div>

              {/* Story & Review Snippet */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {/* Host info and Rating */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-800 font-bold flex items-center justify-center text-xs border border-rose-300">
                        {post.hostName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-800 line-clamp-1">{post.hostName}</div>
                        <div className="text-[10px] text-neutral-500">{post.hostRole} • {post.eventDateBS}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-xs font-bold text-amber-800">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{post.overallRating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-xs text-neutral-600 italic line-clamp-2 mb-3 bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
                    "{post.reviewQuote}"
                  </p>

                  {/* Catering Highlights Pills */}
                  {post.cateringHighlights && post.cateringHighlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {post.cateringHighlights.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 bg-rose-50 text-rose-800 rounded-md border border-rose-200/60"
                        >
                          <Utensils className="w-2.5 h-2.5 text-rose-600" />
                          <span>{item}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Action Bar */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        likeSocialPost(post.id);
                      }}
                      className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                        post.userLiked ? 'text-rose-600' : 'text-neutral-500 hover:text-rose-600'
                      }`}
                    >
                      <Heart
                        className={`w-4 h-4 ${post.userLiked ? 'fill-rose-600 text-rose-600 animate-pulse' : ''}`}
                      />
                      <span>{post.likesCount}</span>
                    </button>

                    <button
                      onClick={(e) => handleShare(post, e)}
                      className="text-neutral-500 hover:text-neutral-800 text-xs flex items-center gap-1 transition-colors"
                      title="Share celebration"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{copiedPostId === post.id ? 'Copied link!' : 'Share'}</span>
                    </button>
                  </div>

                  <button
                    onClick={(e) => handleOpenVenue(post.venueId, e)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-900 group/btn bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    <span>View Venue</span>
                    <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Full Story Modal */}
      {selectedPostForModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setSelectedPostForModal(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Interactive Photo Lightbox */}
            <div className="md:w-3/5 bg-neutral-950 flex flex-col justify-between relative min-h-[300px] sm:min-h-[420px]">
              {/* Photo Display */}
              <div className="relative flex-1 flex items-center justify-center overflow-hidden">
                <img
                  src={selectedPostForModal.photos[activeLightboxPhotoIndex]?.url || selectedPostForModal.coverPhoto}
                  alt={selectedPostForModal.celebrationTitle}
                  className="max-h-[60vh] md:max-h-[80vh] w-auto max-w-full object-contain"
                />

                {/* Left/Right controls if multiple photos */}
                {selectedPostForModal.photos.length > 1 && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLightboxPhotoIndex((prev) =>
                          prev === 0 ? selectedPostForModal.photos.length - 1 : prev - 1
                        );
                      }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveLightboxPhotoIndex((prev) =>
                          prev === selectedPostForModal.photos.length - 1 ? 0 : prev + 1
                        );
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-all border border-white/20"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Photo Tag Badge */}
                {selectedPostForModal.photos[activeLightboxPhotoIndex]?.tag && (
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium border border-white/20">
                    {selectedPostForModal.photos[activeLightboxPhotoIndex].tag?.replace('_', ' ')}
                  </div>
                )}
              </div>

              {/* Photo Thumbnail Strip */}
              {selectedPostForModal.photos.length > 1 && (
                <div className="p-3 bg-neutral-900/90 flex items-center gap-2 overflow-x-auto border-t border-neutral-800">
                  {selectedPostForModal.photos.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveLightboxPhotoIndex(idx)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                        activeLightboxPhotoIndex === idx
                          ? 'border-amber-400 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={photo.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Full Testimonial & Venue Link */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
              <div>
                {/* Close Button on Mobile / Desktop */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-1.5 text-xs text-rose-700 font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{selectedPostForModal.eventType.replace('_', ' ')} Story</span>
                  </div>
                  <button
                    onClick={() => setSelectedPostForModal(null)}
                    className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-serif font-bold text-xl text-neutral-900 mt-3 leading-snug">
                  {selectedPostForModal.celebrationTitle}
                </h3>

                {/* Host Info */}
                <div className="flex items-center gap-3 my-4">
                  <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-900 font-bold flex items-center justify-center text-sm border border-rose-200">
                    {selectedPostForModal.hostName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-neutral-900">{selectedPostForModal.hostName}</div>
                    <div className="text-xs text-neutral-500">
                      {selectedPostForModal.hostRole} • {selectedPostForModal.eventDateBS} ({selectedPostForModal.guestCount} guests)
                    </div>
                  </div>
                </div>

                {/* Rating breakdown */}
                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 mb-4 flex items-center justify-around text-center">
                  <div>
                    <div className="text-xs text-amber-800 font-medium">Overall</div>
                    <div className="text-sm font-bold text-amber-900 flex items-center justify-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{selectedPostForModal.overallRating.toFixed(1)}</span>
                    </div>
                  </div>
                  {selectedPostForModal.cateringRating && (
                    <div className="border-l border-amber-200 pl-3">
                      <div className="text-xs text-amber-800 font-medium">Catering</div>
                      <div className="text-sm font-bold text-amber-900">
                        {selectedPostForModal.cateringRating.toFixed(1)} ★
                      </div>
                    </div>
                  )}
                  {selectedPostForModal.hospitalityRating && (
                    <div className="border-l border-amber-200 pl-3">
                      <div className="text-xs text-amber-800 font-medium">Hospitality</div>
                      <div className="text-sm font-bold text-amber-900">
                        {selectedPostForModal.hospitalityRating.toFixed(1)} ★
                      </div>
                    </div>
                  )}
                </div>

                {/* Full Review Story */}
                <div className="text-sm text-neutral-700 space-y-2 mb-4 leading-relaxed">
                  <blockquote className="font-serif italic text-neutral-900 text-base border-l-2 border-rose-500 pl-3">
                    "{selectedPostForModal.reviewQuote}"
                  </blockquote>
                  {selectedPostForModal.detailedStory && (
                    <p className="text-xs text-neutral-600 mt-2">
                      {selectedPostForModal.detailedStory}
                    </p>
                  )}
                </div>

                {/* Food Highlights */}
                {selectedPostForModal.cateringHighlights && selectedPostForModal.cateringHighlights.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Utensils className="w-3.5 h-3.5 text-rose-600" />
                      <span>Catering Highlights</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPostForModal.cateringHighlights.map((dish, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-lg text-xs font-medium"
                        >
                          {dish}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Sticky Action: Inspect This Venue */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    handleOpenVenue(selectedPostForModal.venueId);
                    setSelectedPostForModal(null);
                  }}
                  className="w-full bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-rose-950 text-white font-semibold py-3 px-4 rounded-xl shadow-md text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <MapPin className="w-4 h-4 text-amber-400" />
                  <span>Inspect {selectedPostForModal.venueName}</span>
                </button>
                <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Protected by UTSAVO Escrow Guarantee</span>
                  </span>
                  <span>{selectedPostForModal.eventDateBS}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Your Celebration Story Modal */}
      {isUploadModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-rose-50/50 rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-sm">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-neutral-900">
                    Share Your Celebration Story
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Showcase your wedding, bratabandha, or reception memories to guide future couples and families.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-200/80 hover:bg-neutral-300 text-neutral-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitStory} className="p-6 space-y-4">
              {/* Venue Selection */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Celebration Venue / Party Palace *
                </label>
                <select
                  value={formData.venueId}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'CUSTOM_VENUE') {
                      setFormData((prev) => ({
                        ...prev,
                        venueId: 'CUSTOM_VENUE',
                        venueName: prev.venueName === venues[0]?.name ? '' : prev.venueName,
                      }));
                    } else {
                      const selected = venues.find((v) => v.id === val);
                      setFormData((prev) => ({
                        ...prev,
                        venueId: val,
                        venueName: selected?.name || prev.venueName,
                        venueDistrict: selected?.district || prev.venueDistrict,
                      }));
                    }
                  }}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                  required
                >
                  {venues.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.district})
                    </option>
                  ))}
                  <option value="CUSTOM_VENUE">✨ Other / Unlisted Venue or Private Celebration (Any Nepal District)</option>
                </select>
              </div>

              {formData.venueId === 'CUSTOM_VENUE' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Venue / Location Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.venueName}
                      onChange={(e) => setFormData((prev) => ({ ...prev, venueName: e.target.value }))}
                      placeholder="e.g. Fishtail Heritage Resort / Family Villa"
                      className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      District (Select or Type Any of 77 Districts) *
                    </label>
                    <NepalDistrictSelector
                      value={formData.venueDistrict}
                      onChange={(dist) => setFormData((prev) => ({ ...prev, venueDistrict: dist }))}
                      placeholder="e.g. Kaski, Mustang, Jhapa..."
                      inputClassName="w-full border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                    />
                  </div>
                </div>
              )}

              {/* Event Type & Celebration Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Occasion / Event Type *
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData((prev) => ({ ...prev, eventType: e.target.value as EventType }))}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                  >
                    <option value="WEDDING">Wedding (विवाह / लगन)</option>
                    <option value="RECEPTION">Reception (प्रीतिभोज)</option>
                    <option value="BRATABANDHA">Bratabandha (उपनयन)</option>
                    <option value="PASNI">Pasni (पास्नी)</option>
                    <option value="CORPORATE_GALA">Corporate Gala / Summit</option>
                    <option value="BIRTHDAY_JUBILEE">Birthday / Jubilee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Celebration Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan & Sneha's Vivah"
                    value={formData.celebrationTitle}
                    onChange={(e) => setFormData((prev) => ({ ...prev, celebrationTitle: e.target.value }))}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Host Name, Role, Guest Headcount & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Host Name(s) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan & Sneha"
                    value={formData.hostName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hostName: e.target.value }))}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Host Role *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Groom & Bride"
                    value={formData.hostRole}
                    onChange={(e) => setFormData((prev) => ({ ...prev, hostRole: e.target.value }))}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Guest Headcount
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={5000}
                    value={formData.guestCount}
                    onChange={(e) => setFormData((prev) => ({ ...prev, guestCount: Number(e.target.value) }))}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Rating & Date BS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Overall Experience Rating (1-5)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFormData((prev) => ({ ...prev, overallRating: star }))}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= formData.overallRating
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-neutral-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-800 ml-2">
                      {formData.overallRating} / 5 Stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Event Date (B.S.)
                  </label>
                  <input
                    type="text"
                    placeholder="2081 Mangsir 20"
                    value={formData.eventDateBS}
                    onChange={(e) => setFormData((prev) => ({ ...prev, eventDateBS: e.target.value }))}
                    className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Review Quote & Detailed Story */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Key Testimonial Quote * (1-2 sentences)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hosting 650 guests without a single hitch. Sound curfew & parking were world-class!"
                  value={formData.reviewQuote}
                  onChange={(e) => setFormData((prev) => ({ ...prev, reviewQuote: e.target.value }))}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                  Detailed Experience Story (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the atmosphere, food taste, valet coordination, generator backup, or staff support..."
                  value={formData.detailedStory}
                  onChange={(e) => setFormData((prev) => ({ ...prev, detailedStory: e.target.value }))}
                  className="w-full border border-neutral-300 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* Photo Upload / URL Addition */}
              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Photo Album (Add Image URLs)</span>
                  <span className="text-[11px] text-neutral-500">{formData.photos.length} added</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-2 mb-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.photoUrlInput}
                    onChange={(e) => setFormData((prev) => ({ ...prev, photoUrlInput: e.target.value }))}
                    className="flex-1 border border-neutral-300 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none bg-white"
                  />
                  <select
                    value={formData.photoTagInput}
                    onChange={(e) => setFormData((prev) => ({ ...prev, photoTagInput: e.target.value as any }))}
                    className="border border-neutral-300 rounded-xl px-2 py-2 text-xs bg-white"
                  >
                    <option value="STAGE_MANDAP">Mandap / Stage</option>
                    <option value="DINING_BUFFET">Dining / Buffet</option>
                    <option value="ENTRANCE">Entrance / Lobby</option>
                    <option value="COUPLE_PORTRAIT">Couple / Host</option>
                    <option value="CANDID">Candid / Guests</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddPhotoToStory}
                    className="bg-neutral-800 hover:bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-xl"
                  >
                    Add Photo
                  </button>
                </div>

                {/* Preset Quality Sample Images */}
                <div className="text-[11px] text-neutral-500 mb-2">
                  Or pick a photo preset:
                  <div className="flex gap-2 mt-1 overflow-x-auto pb-1">
                    {[
                      { name: 'Red Mandap', url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80', tag: 'STAGE_MANDAP' },
                      { name: 'Garden Lawn', url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80', tag: 'STAGE_MANDAP' },
                      { name: 'Lakeside Mandap', url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80', tag: 'STAGE_MANDAP' },
                      { name: 'Buffet Table', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1200&q=80', tag: 'DINING_BUFFET' },
                    ].map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            photos: [...prev.photos, { url: preset.url, caption: preset.name, tag: preset.tag as any }],
                          }))
                        }
                        className="px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[10px] font-medium hover:border-rose-500 hover:text-rose-700 shrink-0"
                      >
                        + {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thumbnails of added photos */}
                {formData.photos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pt-2 border-t border-neutral-200">
                    {formData.photos.map((p, i) => (
                      <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-neutral-300">
                        <img src={p.url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }))}
                          className="absolute top-0 right-0 bg-red-600 text-white rounded-bl p-0.5"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-5 py-2.5 border border-neutral-300 text-neutral-700 hover:bg-neutral-100 rounded-xl text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-rose-950 text-white rounded-xl text-sm font-semibold shadow-md flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Publish Story to Social Wall</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
