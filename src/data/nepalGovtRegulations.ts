/**
 * UTSAVO - Nepal Government Statutory Regulatory Directives & Rules Seed Data
 * Covers: Labour Act 2074, Local Administration Act 2028 (10 PM Curfew),
 * IRD 13% VAT & TDS, Food Safety Act 2081, and Consumer Protection Act 2075.
 */

import { NepalGovtDirectiveItem } from '../types';

export const NEPAL_GOVT_STATUTORY_WAGES = {
  DAILY_SHIFT_MIN_NPR: 668,
  HOURLY_MIN_NPR: 89,
  MONTHLY_MIN_NPR: 17300,
  ACT_NAME_EN: 'Nepal Labour Act 2074 & Ministry of Labour Gazette',
  ACT_NAME_NE: 'नेपाल श्रम ऐन २०७४ तथा श्रम मन्त्रालय राजपत्र सूचना',
  DEARNESS_ALLOWANCE_NPR: 6480,
  BASIC_MONTHLY_NPR: 10820,
};

export const NEPAL_GOVT_VENUE_RULES = {
  DAO_SOUND_CURFEW_TIME: '22:00 (10:00 PM)',
  DAO_SOUND_DECIBEL_LIMIT: '70 dB(A) at property perimeter',
  IRD_VAT_RATE_PERCENT: 13,
  IRD_TDS_RATE_PERCENT: 1.5,
  FOOD_SAFETY_ACT_YEAR: '2081 BS',
  LEGAL_CONTRACT_ACT: 'Nepal Contract Act 2056',
};

export const SEED_NEPAL_GOVT_DIRECTIVES: NepalGovtDirectiveItem[] = [
  {
    id: 'gov-rule-01',
    category: 'LABOUR_ACT_WAGE',
    actTitle: 'Nepal Labour Act 2074 & Gazette Notice',
    actTitleNepali: 'नेपाल श्रम ऐन २०७४ तथा श्रम, रोजगार मन्त्रालयको राजपत्र सूचना',
    gazetteNoticeRef: 'Nepal Gazette Vol. 73 Part 5 (२०८० साउन १)',
    effectiveDateBS: '2080 Shrawan 01',
    currentEnforcedValue: 'NPR 668 / 8-hr Shift (NPR 17,300/month or NPR 89/hr)',
    proposedGazetteUpdate: undefined,
    impactOnPlatform: 'Enforced platform-wide: No banquet venue or vendor can offer wages below NPR 668/day shift. All workers defaulting to optional wage are automatically protected at this statutory threshold.',
    impactOnPlatformNepali: 'कुनै पनि पार्टी प्यालेस वा क्याटररले दैनिक रू. ६६८ भन्दा कम दिन पाउने छैन। पारिश्रमिक नतोकेका कामदारलाई सोझै यो न्यूनतम दर लागू हुन्छ।',
    status: 'ACTIVE_ENFORCED',
    verifiedSourceUrl: 'https://moless.gov.np',
    lastScannedAt: new Date().toISOString(),
  },
  {
    id: 'gov-rule-02',
    category: 'DAO_SOUND_CURFEW',
    actTitle: 'District Administration Office (DAO) Public Peace & Sound Pollution Directives',
    actTitleNepali: 'जिल्ला प्रशासन कार्यालय (काठमाडौँ/ललितपुर) ध्वनि प्रदूषण नियन्त्रण तथा रात्रीकालीन सुरक्षा मापदण्ड',
    gazetteNoticeRef: 'DAO Directives 2079 / Local Administration Act 2028',
    effectiveDateBS: '2079 Baishakh 15',
    currentEnforcedValue: 'Sound consoles, DJs, & brass bands must stop strictly at 10:00 PM (२२:००)',
    proposedGazetteUpdate: 'Draft proposal: DAO Kathmandu reviewing festive exceptions up to 10:30 PM for soundproof indoor halls with acoustic insulation cert.',
    impactOnPlatform: 'All digital run-of-shows and banquet contracts generate automatic 10:00 PM sound cutoff warnings to party palace hosts and DJs.',
    impactOnPlatformNepali: 'सबै डिजिटल सम्झौता र कार्यक्रम तालिकामा राति १०:०० बजे डिजे तथा बाजा बन्द गर्ने वैधानिक चेतावनी स्वतः समावेश हुन्छ।',
    status: 'ACTIVE_ENFORCED',
    verifiedSourceUrl: 'https://daokathmandu.moha.gov.np',
    lastScannedAt: new Date().toISOString(),
  },
  {
    id: 'gov-rule-03',
    category: 'IRD_VAT_TDS',
    actTitle: 'Inland Revenue Department (IRD) VAT & Tax Deducted at Source (TDS) Regulations',
    actTitleNepali: 'आन्तरिक राजस्व विभाग - मूल्य अभिवृद्धि कर (भ्याट १३%) तथा अग्रिम कर कट्टी (TDS १.५%)',
    gazetteNoticeRef: 'Finance Act 2081 / Value Added Tax Act 2052',
    effectiveDateBS: '2081 Shrawan 01',
    currentEnforcedValue: '13% VAT mandatory for registered party palaces; 1.5% TDS on venue lease and service billing',
    proposedGazetteUpdate: undefined,
    impactOnPlatform: 'Automated escrow breakdown separates 13% VAT and 1.5% TDS line items for clear tax filing and verified PAN invoice reconciliation.',
    impactOnPlatformNepali: 'प्रत्येक बुकिङ कोटेशनमा १३% भ्याट र १.५% टीडीएस प्रस्ट देखाई कर चुहावट रोक्न मद्दत गर्दछ।',
    status: 'ACTIVE_ENFORCED',
    verifiedSourceUrl: 'https://ird.gov.np',
    lastScannedAt: new Date().toISOString(),
  },
  {
    id: 'gov-rule-04',
    category: 'FOOD_SAFETY_ACT',
    actTitle: 'Food Safety & Quality Act 2081 (DFTQC)',
    actTitleNepali: 'खाद्य स्वच्छता तथा गुणस्तर ऐन, २०८१ (खाद्य प्रविधि तथा गुण नियन्त्रण विभाग)',
    gazetteNoticeRef: 'Nepal Gazette Part 2 (२०८१ वैशाख)',
    effectiveDateBS: '2081 Baishakh 23',
    currentEnforcedValue: 'Mandatory food temperature tracking, deep clean water filter verification & safe waste handling',
    proposedGazetteUpdate: 'New circular: Mandatory food hygiene inspection logbook on banquet catering premises starting 2081 Ashwin.',
    impactOnPlatform: 'Venue onboarding includes DFTQC food hygiene checklist. Commercial kitchens must submit water purity verification status.',
    impactOnPlatformNepali: 'पार्टी प्यालेस तथा क्याटरिङ भान्साको पानी परीक्षण तथा स्वच्छता प्रमाणपत्र अपलोड गर्नुपर्ने व्यवस्था।',
    status: 'PENDING_ADMIN_DECISION',
    verifiedSourceUrl: 'https://dftqc.gov.np',
    lastScannedAt: new Date().toISOString(),
  },
  {
    id: 'gov-rule-05',
    category: 'MUNICIPAL_BANQUET_CODE',
    actTitle: 'Kathmandu & Lalitpur Metropolitan City Banquet Operation Bye-Laws',
    actTitleNepali: 'काठमाडौँ तथा ललितपुर महानगरपालिका पार्टी प्यालेस तथा सभाहल सञ्चालन कार्यविधि',
    gazetteNoticeRef: 'Municipal Assembly Notice 2080',
    effectiveDateBS: '2080 Kartik 10',
    currentEnforcedValue: 'At least 25% of banquet plot area dedicated to off-street guest vehicle parking',
    proposedGazetteUpdate: undefined,
    impactOnPlatform: 'Venues with confirmed off-street valet parking obtain verified green parking badges to prevent roadside congestion.',
    impactOnPlatformNepali: 'पार्टी प्यालेसको २५% क्षेत्रफल अनिवार्य पार्किङ हुनुपर्ने प्रावधानको पालना स्थिति प्रमाणीकरण।',
    status: 'ACTIVE_ENFORCED',
    verifiedSourceUrl: 'https://kathmandu.gov.np',
    lastScannedAt: new Date().toISOString(),
  },
];
