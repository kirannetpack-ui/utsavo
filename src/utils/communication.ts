/**
 * UTSAVO — WhatsApp & Viber Click-to-Chat Utilities
 * Direct messaging helpers formatted for Nepal phone numbers and mobile deep links
 */

export const sanitizeNepalPhone = (phone: string): string => {
  // Remove non-numeric characters
  let clean = phone.replace(/[^0-9]/g, '');
  // If starts with 98 or 97 and length 10, prepend 977 (Nepal country code)
  if (clean.length === 10 && (clean.startsWith('98') || clean.startsWith('97') || clean.startsWith('01'))) {
    clean = '977' + clean;
  }
  return clean || '9779800000000';
};

export const getWhatsAppUrl = (phone: string, text: string): string => {
  const sanitized = sanitizeNepalPhone(phone);
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${sanitized}?text=${encodedText}`;
};

export const getViberUrl = (phone: string, text?: string): string => {
  const sanitized = sanitizeNepalPhone(phone);
  // Viber mobile deep link and desktop fallback
  return `viber://chat?number=%2B${sanitized}`;
};

export const createVenueInquiryMessage = (
  venueName: string,
  eventType: string = 'Wedding / शुभ विवाह',
  dateBS: string = 'Subha Muhurat',
  guests: number = 350
): string => {
  return `नमस्ते! I discovered *${venueName}* on UTSAVO (Nepal's Celebration Marketplace).

I am inquiring about booking your venue:
🎊 *Occasion*: ${eventType}
📅 *Preferred Date*: ${dateBS}
👥 *Estimated Guests*: ~${guests} persons

Could you please confirm availability and share your current per-plate menu packages and hall policy? Dhanyabad!`;
};

export const createVendorInquiryMessage = (
  vendorName: string,
  category: string,
  dateBS: string = 'Upcoming Event',
  location: string = 'Kathmandu Valley'
): string => {
  return `नमस्ते! I saw *${vendorName}* (${category}) on UTSAVO.

I would like to inquire about your availability and package rates:
📅 *Occasion Date*: ${dateBS}
📍 *Location*: ${location}

Please share your standard package details and booking terms. Dhanyabad!`;
};

export const createDestinationInquiryMessage = (
  packageTitle: string,
  destination: string,
  inquiryRef?: string
): string => {
  return `नमस्ते UTSAVO Destination Concierge!

I am inquiring regarding the *${packageTitle}* in *${destination}*.
${inquiryRef ? `Reference ID: ${inquiryRef}\n` : ''}
We would like to discuss high-altitude logistics, luxury guest accommodation, and customized itineraries. Please connect with our family!`;
};

export const getPublicInvitationUrl = (invitationCode: string): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/invite/${invitationCode}`;
  }
  return `https://utsavo.com/invite/${invitationCode}`;
};

export const createNimantranaShareMessage = (
  celebrantsTitle: string,
  eventType: string,
  dateBS: string,
  venueName: string,
  invitationCode: string,
  customUrl?: string
): string => {
  const inviteUrl = customUrl || getPublicInvitationUrl(invitationCode);
  return `🙏 *हार्दिक निमन्त्रणा (Cordially Invited)* 🙏

We warmly invite you and your family to bless the auspicious *${eventType}* of *${celebrantsTitle}*.

📅 *मिति (Date)*: ${dateBS}
📍 *स्थान (Venue)*: ${venueName}

Please view our digital invitation card and confirm your attendance (RSVP) here:
👉 ${inviteUrl}

(Your early RSVP helps our venue kitchen team prepare with zero food wastage)
धन्यवाद!`;
};
